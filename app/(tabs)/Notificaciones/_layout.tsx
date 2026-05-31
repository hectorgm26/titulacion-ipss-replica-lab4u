import { Stack } from "expo-router";

export default function NotificacionesLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitleAlign: "center" }}>
      <Stack.Screen
        name="index"
        options={{ title: "Centro de Notificaciones" }}
      />
    </Stack>
  );
}
