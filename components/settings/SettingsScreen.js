import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "../../locales/i18n";
import { useTheme } from "../../hooks/useTheme";
import SearchOptionsScreen from "./SearchOptionsScreen";
import LanguageScreen from "./LanguageScreen";
import DataBackupScreen from "./DataBackupScreen";
import { Feather } from "@expo/vector-icons";

const SettingsScreen = ({ memos, prompts, onImportData, onClose }) => {
  const insets = useSafeAreaInsets();
  const { theme, themePreference, setTheme } = useTheme();
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showLanguageScreen, setShowLanguageScreen] = useState(false);
  const [showBackupScreen, setShowBackupScreen] = useState(false);

  if (showSearchOptions) {
    return <SearchOptionsScreen onClose={() => setShowSearchOptions(false)} />;
  }

  if (showLanguageScreen) {
    return <LanguageScreen onClose={() => setShowLanguageScreen(false)} />;
  }

  if (showBackupScreen) {
    return (
      <DataBackupScreen
        memos={memos}
        prompts={prompts}
        onImportData={onImportData}
        onClose={() => setShowBackupScreen(false)}
      />
    );
  }

  const themeOptions = [
    { key: "system", label: i18n.t("systemTheme") },
    { key: "light", label: i18n.t("lightTheme") },
    { key: "dark", label: i18n.t("darkTheme") },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {i18n.t("settings")}
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("close")}
        >
          <Feather name="x" size={21} color={theme.text} />
        </Pressable>
      </View>
      <View
        style={[
          styles.settingBlock,
          {
            backgroundColor: theme.backgroundSecondary,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.settingText, { color: theme.text }]}>
          {i18n.t("themeMode")}
        </Text>
        <View style={styles.segmentedControl}>
          {themeOptions.map((option) => {
            const isSelected = themePreference === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => setTheme(option.key)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: isSelected
                      ? theme.primary
                      : theme.textInputBG,
                    borderColor: theme.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={option.label}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: isSelected ? theme.primaryText : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Pressable
        style={[
          styles.settingItem,
          {
            backgroundColor: theme.backgroundSecondary,
            borderBottomColor: theme.border,
          },
        ]}
        onPress={() => setShowSearchOptions(true)}
        accessibilityRole="button"
        accessibilityLabel={i18n.t("searchOptionsTitle")}
      >
        <Text style={[styles.settingText, { color: theme.text }]}>
          {i18n.t("search")}
        </Text>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
      <Pressable
        style={[
          styles.settingItem,
          {
            backgroundColor: theme.backgroundSecondary,
            borderBottomColor: theme.border,
          },
        ]}
        onPress={() => setShowBackupScreen(true)}
        accessibilityRole="button"
        accessibilityLabel={i18n.t("dataBackup")}
      >
        <Text style={[styles.settingText, { color: theme.text }]}>
          {i18n.t("dataBackup")}
        </Text>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
      <Pressable
        style={[
          styles.settingItem,
          {
            backgroundColor: theme.backgroundSecondary,
            borderBottomColor: theme.border,
          },
        ]}
        onPress={() => setShowLanguageScreen(true)}
        accessibilityRole="button"
        accessibilityLabel={i18n.t("language")}
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
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  settingBlock: {
    padding: 20,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: "600",
  },
});

export default SettingsScreen;
