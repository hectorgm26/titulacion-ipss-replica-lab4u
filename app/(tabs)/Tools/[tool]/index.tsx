import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { getToolConfig } from "@/lib/toolConfig";
import { loadUserProfile } from "@/lib/userProfile";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ToolProfileScreen() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const config = getToolConfig(tool);
  const [isPremium, setIsPremium] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile().then((profile) => {
        setIsPremium(profile?.plan === "premium");
      });
    }, []),
  );

  if (!config) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Herramienta no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLocked = config.premium && !isPremium;

  function handleStartMeasurement() {
    if (isLocked) {
      Alert.alert(
        "🔒 Herramienta Premium",
        `"${config!.name}" está disponible solo para usuarios Premium.\n\nActualiza tu plan en la pestaña "Plan de Usuario" para desbloquearla.`,
        [
          { text: "Ahora no", style: "cancel" },
          {
            text: "Ver planes",
            onPress: () => router.push("/(tabs)/Deal"),
          },
        ],
      );
      return;
    }
    ToolsAnalytics.startMeasurementClick(tool);
    router.push(`/(tabs)/Tools/${tool}/measure`);
  }

  function handleSavedMeasurements() {
    if (isLocked) {
      Alert.alert(
        "🔒 Herramienta Premium",
        `"${config!.name}" está disponible solo para usuarios Premium.\n\nActualiza tu plan en la pestaña "Plan de Usuario" para desbloquearla.`,
        [
          { text: "Ahora no", style: "cancel" },
          {
            text: "Ver planes",
            onPress: () => router.push("/(tabs)/Deal"),
          },
        ],
      );
      return;
    }
    ToolsAnalytics.goToSavedMeasurementList(tool);
    router.push(`/(tabs)/Tools/${tool}/saved`);
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: config.colorLight }]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.heroBox}>
          <View style={styles.emojiWrapper}>
            <Text style={styles.emoji}>{config.emoji}</Text>
            {isLocked && (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockEmoji}>🔒</Text>
              </View>
            )}
          </View>
          <Text
            style={[styles.title, { color: isLocked ? "#aaa" : config.color }]}
          >
            {config.name}
          </Text>
          {isLocked && (
            <View style={styles.premiumBanner}>
              <Text style={styles.premiumBannerText}>
                ⭐ Disponible en plan Premium
              </Text>
            </View>
          )}
          <Text style={styles.description}>{config.description}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsBox}>
          <TouchableOpacity
            style={[
              styles.btnPrimary,
              { backgroundColor: isLocked ? "#bbb" : config.color },
            ]}
            activeOpacity={0.8}
            onPress={handleStartMeasurement}
          >
            <Text style={styles.btnPrimaryText}>
              {isLocked ? "🔒  Iniciar Medición" : "▶  Iniciar Medición"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnSecondary,
              { borderColor: isLocked ? "#ccc" : config.color },
            ]}
            activeOpacity={0.8}
            onPress={handleSavedMeasurements}
          >
            <Text
              style={[
                styles.btnSecondaryText,
                { color: isLocked ? "#bbb" : config.color },
              ]}
            >
              📋 Mediciones Guardadas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 16, color: "#999" },
  heroBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emojiWrapper: { position: "relative", marginBottom: 8 },
  emoji: { fontSize: 72 },
  lockOverlay: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  lockEmoji: { fontSize: 18 },
  title: { fontSize: 30, fontWeight: "800", textAlign: "center" },
  premiumBanner: {
    backgroundColor: "#fff8e1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ffe082",
  },
  premiumBannerText: { fontSize: 13, fontWeight: "700", color: "#f57f17" },
  description: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  buttonsBox: { gap: 14 },
  btnPrimary: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  btnPrimaryText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  btnSecondary: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  btnSecondaryText: { fontSize: 16, fontWeight: "600" },
});
