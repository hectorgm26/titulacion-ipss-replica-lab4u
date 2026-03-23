import { Stack } from "expo-router";

export default function RankingLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Top 5" }} />
    </Stack>
  );
}
