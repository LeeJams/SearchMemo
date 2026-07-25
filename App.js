import MemoHome from "./components/memo/MemoHome";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "./hooks/useTheme";
import { useTheme } from "./hooks/useTheme";
import { LanguageProvider } from "./hooks/useLanguage";

function AppContent() {
  const { themeName } = useTheme();
  return (
    <>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />
      <MemoHome />
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
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
