import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes } from "../utill/theme";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeName, setThemeName] = useState("light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setThemeName(storedTheme);
      } else {
        setThemeName(systemTheme || "light");
      }
    };
    loadTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    const newThemeName = themeName === "light" ? "dark" : "light";
    setThemeName(newThemeName);
    await AsyncStorage.setItem("theme", newThemeName);
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
