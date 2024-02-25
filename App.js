import MemoHome from "./components/memo/MemoHome";
import { useEffect, useState } from "react";
import * as Font from "expo-font";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const fontsLoaded = async () => {
      await Font.loadAsync({
        NotoSansKR: require("./assets/fonts/NotoSansKR-Medium.ttf"),
      });

      setFontLoaded(true);
    };
    fontsLoaded();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return <MemoHome />;
}
