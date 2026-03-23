import { useColorScheme } from "@/hooks/use-color-scheme";
import { BlossomThemeProvider } from "@react-native-blossom-ui/components";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../utils/firebase";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <BlossomThemeProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              headerShadowVisible: false,
              contentStyle: { marginTop: insets.top },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, headerShadowVisible: false }}
            />
          </Stack>

          <StatusBar
            style="light"
            backgroundColor="black"
            translucent={false}
          />
        </ThemeProvider>
        <Toast />
      </BlossomThemeProvider>
    </SafeAreaProvider>
  );
}
