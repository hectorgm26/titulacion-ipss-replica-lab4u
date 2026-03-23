import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Favoritos" }} />
    </Stack>
  );
}
