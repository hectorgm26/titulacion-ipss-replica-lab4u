import { Stack } from "expo-router";

export default function AbogadosLayout() {
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
      <Stack.Screen name="index" options={{ title: "Abogados" }} />
      <Stack.Screen name="AddAbogadoScreen" options={{ title: "Agregar" }} />
    </Stack>
  );
}
