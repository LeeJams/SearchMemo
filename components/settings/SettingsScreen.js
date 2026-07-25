import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../../locales/i18n";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import SearchOptionsScreen from "./SearchOptionsScreen";
import LanguageScreen from "./LanguageScreen";
import DataBackupScreen from "./DataBackupScreen";
import { Feather } from "@expo/vector-icons";

const SettingsScreen = ({ memos, folders, onImportData, onClose }) => {
  const { theme, themePreference, setTheme } = useTheme();
  useLanguage();
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
        prompts={[]}
        folders={folders}
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
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.background }]}
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
      <ScrollView
        style={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
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
        <SettingItem
          label={i18n.t("search")}
          accessibilityLabel={i18n.t("searchOptionsTitle")}
          onPress={() => setShowSearchOptions(true)}
        />
        <SettingItem
          label={i18n.t("dataBackup")}
          onPress={() => setShowBackupScreen(true)}
        />
        <SettingItem
          label={i18n.t("language")}
          onPress={() => setShowLanguageScreen(true)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

function SettingItem({ label, accessibilityLabel, onPress }) {
  const { theme } = useTheme();
  return (
    <Pressable
      style={[
        styles.settingItem,
        {
          backgroundColor: theme.backgroundSecondary,
          borderBottomColor: theme.border,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <Text style={[styles.settingText, { color: theme.text }]}>{label}</Text>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    minHeight: 58,
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
    minHeight: 64,
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
    justifyContent: "center",
    minHeight: 44,
    borderRadius: 6,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
});

export default SettingsScreen;
