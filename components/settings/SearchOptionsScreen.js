import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import {
  allSearchOptions,
  getSelectedSearchOptions,
  saveSelectedSearchOptions,
} from "../../utill/option";
import i18n from "../../locales/i18n";
import { searchIconMap } from "../icons/SearchIcons";

const SearchOptionsScreen = ({ onClose }) => {
  const { theme } = useTheme();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSelectedOptions();
  }, []);

  const loadSelectedOptions = async () => {
    try {
      setLoading(true);
      const selected = await getSelectedSearchOptions();
      setSelectedOptions(selected);
    } catch (error) {
      console.error("Failed to load options:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (key) => {
    setSelectedOptions((prev) => {
      if (prev.includes(key)) {
        // 최소 1개는 선택되어 있어야 함
        if (prev.length > 1) {
          return prev.filter((k) => k !== key);
        }
        return prev;
      } else {
        return [...prev, key];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveSelectedSearchOptions(selectedOptions);
      onClose();
    } catch (error) {
      console.error("Failed to save options:", error);
    } finally {
      setSaving(false);
    }
  };

  // 지역별로 그룹화
  const groupedOptions = allSearchOptions.reduce((acc, option) => {
    if (!acc[option.region]) {
      acc[option.region] = [];
    }
    acc[option.region].push(option);
    return acc;
  }, {});

  const regionLabels = {
    global: i18n.t("regionGlobal"),
    ai: i18n.t("regionAI"),
    kr: i18n.t("regionKR"),
    cn: i18n.t("regionCN"),
    jp: i18n.t("regionJP"),
    us: i18n.t("regionUS"),
    ru: i18n.t("regionRU"),
    in: i18n.t("regionIN"),
    de: i18n.t("regionDE"),
    fr: i18n.t("regionFR"),
  };

  const renderIcon = (option) => {
    const IconComponent = searchIconMap[option.key];
    if (!IconComponent) return null;
    return <IconComponent size={20} />;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View
        style={[styles.header, { backgroundColor: theme.backgroundSecondary }]}
      >
        <Pressable onPress={onClose} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {i18n.t("searchOptionsTitle")}
        </Text>
        <Pressable
          onPress={handleSave}
          style={[styles.saveButton, saving && styles.disabledButton]}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, { color: theme.primary }]}>
            {saving ? i18n.t("saving") : i18n.t("save")}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {i18n.t("searchOptionsDescription")}
        </Text>

        {Object.entries(groupedOptions).map(([region, options]) => (
          <View key={region} style={styles.regionSection}>
            <Text style={[styles.regionTitle, { color: theme.text }]}>
              {regionLabels[region] || region}
            </Text>
            {options.map((option) => (
              <Pressable
                key={option.key}
                style={[
                  styles.optionItem,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => toggleOption(option.key)}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.optionIcon}>{renderIcon(option)}</View>
                  <Text style={[styles.optionLabel, { color: theme.text }]}>
                    {option.label}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: selectedOptions.includes(option.key)
                        ? theme.primary
                        : theme.background,
                      borderColor: selectedOptions.includes(option.key)
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                >
                  {selectedOptions.includes(option.key) && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  description: {
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  regionSection: {
    marginBottom: 24,
  },
  regionTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchOptionsScreen;
