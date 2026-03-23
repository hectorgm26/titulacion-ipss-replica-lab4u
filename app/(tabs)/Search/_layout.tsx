import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Buscar" }} />
    </Stack>
  );
}
