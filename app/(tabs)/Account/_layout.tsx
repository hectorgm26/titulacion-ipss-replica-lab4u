import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        animation: "slide_from_right",
        animationMatchesGesture: true,
        fullScreenGestureEnabled: true,
        gestureDirection: "horizontal",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Cuenta" }} />
      <Stack.Screen
        name="LoginScreen/LoginScreen"
        options={{ title: "Iniciar Sesión" }}
      />
      <Stack.Screen
        name="RegisterScreen/RegisterScreen"
        options={{ title: "Crea tu Cuenta" }}
      />
    </Stack>
  );
}
