import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { getActionOptions } from "../../utill/option";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchIconMap } from "../icons/SearchIcons";
import i18n from "../../locales/i18n";

const { buildActionGridRows } = require("../../utill/memoActionLayout");
const {
  buildSearchLaunchPlan,
  executeSearchLaunch,
} = require("../../utill/searchActionModel");

function MemoActionModal({ visible, closeModal, selectedMemo }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchOptions, setSearchOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchOptionRows = useMemo(
    () => buildActionGridRows(searchOptions),
    [searchOptions]
  );

  useEffect(() => {
    if (visible) {
      loadActionOptions();
    }
  }, [visible]);

  const loadActionOptions = async () => {
    try {
      setLoading(true);
      const options = await getActionOptions();
      setSearchOptions(options);
    } catch (error) {
      console.error("Failed to load action options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionPress = async (option) => {
    if (!selectedMemo) return;

    try {
      const launchPlan = buildSearchLaunchPlan(
        option,
        selectedMemo.text,
        Platform.OS
      );
      await executeSearchLaunch(launchPlan, {
        copyText: Clipboard.setStringAsync,
        openUrl: (url) => Linking.openURL(url),
      });
      closeModal();
    } catch (error) {
      console.error("Failed to handle memo action:", error);
      Alert.alert(i18n.t("searchAction"), i18n.t("openLinkError"));
    }
  };

  const renderIcon = (option) => {
    const IconComponent = searchIconMap[option.key];
    if (!IconComponent) return null;

    return (
      <IconComponent
        size={23}
        color={
          option.color || (option.key === "chatgpt" ? theme.text : undefined)
        }
      />
    );
  };

  const renderOption = (option) => (
    <View
      key={option.key}
      style={[styles.optionWrapper, { opacity: selectedMemo ? 1 : 0.5 }]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.optionButton,
          {
            backgroundColor: theme.textInputBG,
            borderColor: theme.border,
          },
          pressed && { backgroundColor: theme.textInputBG },
        ]}
        onPress={() => handleOptionPress(option)}
        android_ripple={{ color: theme.border }}
        disabled={!selectedMemo}
        accessibilityRole="button"
        accessibilityLabel={option.label}
      >
        {renderIcon(option)}
        <Text
          style={[styles.optionText, { color: theme.text }]}
        >
          {option.label}
        </Text>
      </Pressable>
    </View>
  );

  const sheetContent = (
    <View style={styles.modalLayer}>
      <Pressable
        style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        onPress={closeModal}
      >
        <View style={styles.sheetWrapper}>
          <Pressable
            style={[
              styles.optionsContainer,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
            </View>
            <View
              style={[styles.sheetHeader, { borderBottomColor: theme.border }]}
            >
              <View
                style={[
                  styles.sheetHeaderIcon,
                  { backgroundColor: theme.textInputBG },
                ]}
              >
                <Feather name="search" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                {i18n.t("searchServices")}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
                onPress={closeModal}
                accessibilityRole="button"
                accessibilityLabel={i18n.t("close")}
              >
                <Feather name="x" size={20} color={theme.textSecondary} />
              </Pressable>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : (
              <ScrollView
                style={styles.searchScroll}
                contentContainerStyle={[
                  styles.scrollContainer,
                  { paddingBottom: Math.max(14, insets.bottom + 8) },
                ]}
                showsVerticalScrollIndicator={false}
              >
                {searchOptions.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      {i18n.t("noSearchServiceSelected")}
                    </Text>
                  </View>
                )}
                {searchOptionRows.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} style={styles.optionRow}>
                    {row.map((option, columnIndex) =>
                      option ? (
                        renderOption(option)
                      ) : (
                        <View
                          key={`placeholder-${rowIndex}-${columnIndex}`}
                          style={styles.optionWrapper}
                          accessibilityElementsHidden
                          importantForAccessibility="no-hide-descendants"
                        />
                      )
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </Pressable>
        </View>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={closeModal}
      transparent
    >
      {sheetContent}
    </Modal>
  );
}

export default React.memo(MemoActionModal);

const styles = StyleSheet.create({
  modalLayer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
    maxHeight: "78%",
  },
  optionsContainer: {
    width: "100%",
    maxHeight: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 2,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  sheetHeaderIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "NotoSansKR",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  searchScroll: {
    flexShrink: 1,
  },
  scrollContainer: {
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  optionRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionWrapper: {
    flex: 1,
    alignItems: "center",
  },
  optionButton: {
    width: "100%",
    minHeight: 82,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 12,
    fontFamily: "NotoSansKR",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.72,
  },
  loadingContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  emptyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "NotoSansKR-Regular",
  },
});
