import { getToolConfig } from "@/lib/toolConfig";
import { Stack, useLocalSearchParams } from "expo-router";

function ToolHeader() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const config = getToolConfig(tool ?? "");
  return config?.name ?? "Herramienta";
}

export default function ToolsLayout() {
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
      <Stack.Screen name="index" options={{ title: "Herramientas" }} />
      <Stack.Screen
        name="[tool]/index"
        options={{ title: "Perfil de Herramienta" }}
      />
      <Stack.Screen name="[tool]/measure" options={{ title: "Medición" }} />
      <Stack.Screen name="[tool]/result" options={{ title: "Resultados" }} />
      <Stack.Screen
        name="[tool]/saved"
        options={{ title: "Mediciones Guardadas" }}
      />
    </Stack>
  );
}
