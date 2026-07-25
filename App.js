import React, { useMemo } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import RootNavigator from "./components/navigation/RootNavigator";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import { LanguageProvider } from "./hooks/useLanguage";
import { MemoStoreProvider } from "./hooks/useMemoStore";

function AppContent() {
  const { theme, themeName } = useTheme();
  const navigationTheme = useMemo(() => {
    const base = themeName === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.background,
        text: theme.text,
        border: theme.border,
      },
    };
  }, [theme, themeName]);

  return (
    <>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />
      <NavigationContainer theme={navigationTheme}>
        <MemoStoreProvider>
          <RootNavigator />
        </MemoStoreProvider>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("./assets/fonts/NotoSansKR-Medium.ttf"),
    "NotoSansKR-Regular": require("./assets/fonts/NotoSansKR-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
