import MemoHome from "./components/memo/MemoHome";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./hooks/useTheme";

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
      <ThemeProvider>
        <MemoHome />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
