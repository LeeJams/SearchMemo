import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes } from "../utill/theme";
import { useColorScheme } from "react-native";

const THEME_KEY = "theme";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themePreference, setThemePreference] = useState("system");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        setThemePreference(storedTheme || "system");
      } catch (error) {
        console.error("Failed to load theme", error);
        setThemePreference("system");
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newThemePreference) => {
    setThemePreference(newThemePreference);
    await AsyncStorage.setItem(THEME_KEY, newThemePreference);
  };

  const toggleTheme = async () => {
    const nextTheme =
      themePreference === "light"
        ? "dark"
        : themePreference === "dark"
        ? "system"
        : "light";
    await setTheme(nextTheme);
  };

  const resolvedThemeName =
    themePreference === "system" ? systemTheme || "light" : themePreference;
  const theme = themes[resolvedThemeName] || themes.light;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName: resolvedThemeName,
        themePreference,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
