import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "../../locales/i18n";
import { useTheme } from "../../hooks/useTheme";
import SearchOptionsScreen from "./SearchOptionsScreen";
import LanguageScreen from "./LanguageScreen";
import { Feather } from "@expo/vector-icons";

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, themeName, toggleTheme } = useTheme();
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showLanguageScreen, setShowLanguageScreen] = useState(false);

  if (showSearchOptions) {
    return <SearchOptionsScreen onClose={() => setShowSearchOptions(false)} />;
  }

  if (showLanguageScreen) {
    return <LanguageScreen onClose={() => setShowLanguageScreen(false)} />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.backgroundSecondary,
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {i18n.t("settings")}
        </Text>
      </View>
      <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
        <Text style={[styles.settingText, { color: theme.text }]}>
          {i18n.t("theme")}
        </Text>
        <Switch
          value={themeName === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: theme.primary }}
          thumbColor={"#ffffff"}
        />
      </View>
      <Pressable
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => setShowSearchOptions(true)}
      >
        <Text style={[styles.settingText, { color: theme.text }]}>
          {i18n.t("search")}
        </Text>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
      <Pressable
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => setShowLanguageScreen(true)}
      >
        <Text style={[styles.settingText, { color: theme.text }]}>
          {i18n.t("language")}
        </Text>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
});

export default SettingsScreen;
