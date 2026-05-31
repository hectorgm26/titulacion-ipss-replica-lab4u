import { FCMTopicManager } from "@/lib/fcmTopicManager";
import { NotificationStore } from "@/lib/notificationStore";
import { initAnalytics } from "@/services/analytics";
import { BlossomThemeProvider } from "@react-native-blossom-ui/components";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../utils/firebase";

export const unstable_settings = {
  anchor: "(tabs)",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const unsubscribe = FCMTopicManager.onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title ?? "";
      const body = remoteMessage.notification?.body ?? "";

      if (!title && !body) return;

      // 1. Guardar en tu centro interno
      NotificationStore.addIfNew({
        id: remoteMessage.messageId ?? Date.now().toString(),
        title,
        body,
        date: Date.now(),
      });

      // 2. MOSTRAR NOTIFICACIÓN DEL SISTEMA (ESTO ES LO QUE TE FALTABA)
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <BlossomThemeProvider isDark={true}>
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, headerShadowVisible: false }}
          />
        </Stack>

        <StatusBar style="light" backgroundColor="black" translucent={false} />
      </ThemeProvider>
      <Toast />
    </BlossomThemeProvider>
  );
}
