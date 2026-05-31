import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { FCMTopicManager } from "@/lib/fcmTopicManager";
import {
    NotificationItem,
    NotificationStore,
    useNotifications,
} from "@/lib/notificationStore";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    AppState,
    FlatList,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificacionesScreen() {
  const notifications = useNotifications();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isExpoGo, setIsExpoGo] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      ToolsAnalytics.goToNotificationsView();
    }, []),
  );

  // ── Detect Expo Go ────────────────────────────────────────────────────────
  useEffect(() => {
    let nativeAvailable = false;
    try {
      require("@react-native-firebase/messaging");
      nativeAvailable = true;
    } catch {
      nativeAvailable = false;
    }
    setIsExpoGo(!nativeAvailable);
  }, []);

  // ── Check permission status ───────────────────────────────────────────────
  const checkPermission = useCallback(async () => {
    const granted = await FCMTopicManager.hasPermission();
    setPermissionGranted(granted);
    // Only show denied banner if explicitly denied (not just not determined)
    if (!granted) {
      try {
        const Notifications = await import("expo-notifications");
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionDenied(status === "denied");
      } catch {
        setPermissionDenied(false);
      }
    } else {
      setPermissionDenied(false);
    }
  }, []);

  const refreshTopic = useCallback(async () => {
    const topic = await FCMTopicManager.getCurrentTopic();
    setCurrentTopic(topic);
  }, []);

  // Re-check when screen gains focus
  useFocusEffect(
    useCallback(() => {
      checkPermission();
      refreshTopic();
    }, [checkPermission, refreshTopic]),
  );

  // Re-check when app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        checkPermission();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [checkPermission]);

  // Listen for foreground FCM messages (only fires in dev build)
  useEffect(() => {
    const unsubscribe = FCMTopicManager.onMessage((remoteMessage: any) => {
      const title = remoteMessage.notification?.title ?? "";
      const body = remoteMessage.notification?.body ?? "";
      if (!title && !body) return;
      NotificationStore.addIfNew({
        id: remoteMessage.messageId ?? Date.now().toString(),
        title,
        body,
        date: Date.now(),
      });
    });
    return unsubscribe;
  }, []);

  // ── Toggle handler ────────────────────────────────────────────────────────
  async function handleToggle(enabled: boolean) {
    if (enabled) {
      const granted = await FCMTopicManager.requestPermission();
      setPermissionGranted(granted);
      setPermissionDenied(!granted);

      if (granted) {
        await FCMTopicManager.updateSubscriptionsForCurrentUser();
        await refreshTopic();
      } else {
        showSettingsAlert(true);
      }
    } else {
      showSettingsAlert(false);
    }
  }

  function showSettingsAlert(enabling: boolean) {
    const title = enabling
      ? "Activar notificaciones"
      : "Desactivar notificaciones";
    const message = enabling
      ? "Las notificaciones están bloqueadas. Ve a Ajustes para activarlas."
      : "Para desactivar las notificaciones ve a Ajustes de la app.";

    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Ir a Ajustes", onPress: () => Linking.openSettings() },
    ]);
  }

  function handleDelete(id: string) {
    NotificationStore.remove(id);
  }

  function handleClearAll() {
    Alert.alert(
      "Borrar todo",
      "¿Seguro que quieres eliminar todas las notificaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => NotificationStore.clear(),
        },
      ],
    );
  }

  function renderItem({ item }: { item: NotificationItem }) {
    const date = new Date(item.date);
    const timeStr = date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    });

    return (
      <View style={styles.notifCard}>
        <View style={styles.notifContent}>
          <Text style={styles.notifTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.notifBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.notifDate}>
            {dateStr} · {timeStr}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Expo Go warning banner */}
      {isExpoGo && (
        <View style={styles.expoGoBanner}>
          <Text style={styles.expoGoBannerText}>
            ⚠️ Modo Expo Go — las push notifications reales requieren un dev
            build. El topic se construye correctamente pero la suscripción FCM
            es simulada.
          </Text>
        </View>
      )}

      {/* Permission toggle */}
      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>¿Recibir notificaciones?</Text>
        <Switch
          value={permissionGranted}
          onValueChange={handleToggle}
          trackColor={{ true: "#00a680", false: "#ccc" }}
          thumbColor={permissionGranted ? "#fff" : "#f4f4f4"}
        />
      </View>

      {/* Denied banner */}
      {permissionDenied && (
        <View style={styles.deniedBanner}>
          <Text style={styles.deniedText}>
            ⚠️ Las notificaciones están bloqueadas por el sistema. Ve a Ajustes
            para activarlas.
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* FCM Topic info */}
      <View style={styles.topicRow}>
        {currentTopic ? (
          <>
            <Text style={styles.topicLabel}>Topic activo (FCM)</Text>
            <Text style={styles.topicValue} numberOfLines={1}>
              {currentTopic}
            </Text>
            {isExpoGo && (
              <Text style={styles.topicSimulated}>
                (simulado en Expo Go — real en dev build)
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.topicLabelEmpty}>
            Sin topic activo — define tu plan en "Plan de Usuario" y activa las
            notificaciones
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* Notifications list or empty state */}
      {notifications.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🔕</Text>
          <Text style={styles.emptyTitle}>Sin notificaciones</Text>
          <Text style={styles.emptyBody}>
            Aquí aparecerán las notificaciones que recibas a través de Firebase
            Cloud Messaging una vez tengas el dev build activo.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {notifications.length} notificación
              {notifications.length !== 1 ? "es" : ""}
            </Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Borrar todo</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  // Expo Go warning
  expoGoBanner: {
    backgroundColor: "#fff8e1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffe082",
  },
  expoGoBannerText: { fontSize: 12, color: "#f57f17", lineHeight: 17 },
  // Permission toggle
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  permissionLabel: { fontSize: 15, color: "#222" },
  // Denied banner
  deniedBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#fde8e8",
    borderRadius: 10,
  },
  deniedText: { fontSize: 13, color: "#c0392b", lineHeight: 18 },
  divider: { height: 1, backgroundColor: "#f0f0f0" },
  // Topic info
  topicRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f7fdf9",
    gap: 2,
  },
  topicLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  topicValue: {
    fontSize: 13,
    color: "#00a680",
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  topicSimulated: { fontSize: 11, color: "#aaa", fontStyle: "italic" },
  topicLabelEmpty: { fontSize: 13, color: "#aaa", fontStyle: "italic" },
  // Empty state
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  emptyBody: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  // List
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  listHeaderText: { fontSize: 13, color: "#888" },
  clearAllText: { fontSize: 13, color: "#e53935", fontWeight: "600" },
  listContent: { paddingHorizontal: 12, paddingBottom: 32, gap: 8 },
  // Notification card
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 14,
  },
  notifContent: { flex: 1, gap: 3 },
  notifTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  notifBody: { fontSize: 13, color: "#555", lineHeight: 18 },
  notifDate: { fontSize: 11, color: "#aaa", marginTop: 2 },
  deleteBtn: { paddingLeft: 12, paddingTop: 2 },
  deleteBtnText: { fontSize: 18 },
});
