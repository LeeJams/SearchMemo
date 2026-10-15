import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { useMemoStore } from "../../hooks/useMemoStore";
import { getSelectedAIOptions } from "../../utill/option";
import i18n from "../../locales/i18n";
import { searchIconMap } from "../icons/SearchIcons";
import MemoActionModal from "../modal/MemoActionModal";

const { getMemoTitle } = require("../../utill/memoModel");
const { memoActionSheetReducer } = require("../../utill/memoDetailFlow");
const { buildActionGridRows } = require("../../utill/memoActionLayout");
const {
  buildSearchLaunchPlan,
  executeSearchLaunch,
} = require("../../utill/searchActionModel");

export default function MemoDetailScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { findMemo, openEditor, deleteMemo } = useMemoStore();
  const [copied, setCopied] = useState(false);
  const [aiOptions, setAIOptions] = useState([]);
  const aiRows = buildActionGridRows(aiOptions, 4);
  const [launchingService, setLaunchingService] = useState(null);
  const [actionsVisible, dispatchActionSheet] = useReducer(
    memoActionSheetReducer,
    false
  );

  // Deleting pops the screen, but it stays mounted until the animation ends.
  // Keep the last snapshot so the page does not flash empty on the way out.
  const lastMemo = useRef(null);
  const storedMemo = findMemo(route.params?.memoId);
  if (storedMemo) lastMemo.current = storedMemo;
  const memo = storedMemo || lastMemo.current;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getSelectedAIOptions().then((options) => {
        if (active) setAIOptions(options);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  if (!memo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]} />
    );
  }

  const copyMemo = async () => {
    await Clipboard.setStringAsync(memo.text);
    setCopied(true);
  };

  const launchAI = async (option) => {
    if (launchingService) return;
    setLaunchingService(option.key);
    try {
      const launchPlan = buildSearchLaunchPlan(option, memo.text, Platform.OS);
      await executeSearchLaunch(launchPlan, {
        copyText: Clipboard.setStringAsync,
        openUrl: (url) => Linking.openURL(url),
      });
      setCopied(true);
    } catch (error) {
      console.error("Failed to open AI service:", error);
      Alert.alert(i18n.t("aiServices"), i18n.t("openLinkError"));
    } finally {
      setLaunchingService(null);
    }
  };

  const confirmDelete = () => {
    Alert.alert(i18n.t("deleteConfirmTitle"), i18n.t("deleteConfirmMessage"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => {
          navigation.goBack();
          deleteMemo(memo.id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("close")}
        >
          <Feather name="chevron-left" size={24} color={theme.text} />
        </Pressable>
        <Text
          style={[styles.headerTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {getMemoTitle(memo.text)}
        </Text>
        <View
          style={styles.headerButton}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text selectable style={[styles.body, { color: theme.text }]}>
          {memo.text}
        </Text>
        <Text selectable style={[styles.date, { color: theme.textSecondary }]}>
          {memo.date}
        </Text>
      </ScrollView>

      <View style={[styles.actionDock, { borderTopColor: theme.border }]}>
        {aiOptions.length > 0 && (
          <View style={styles.aiSection}>
            <View style={styles.aiHeading}>
              <Text style={[styles.aiTitle, { color: theme.textSecondary }]}>
                {i18n.t("aiServices")}
              </Text>
              <View style={styles.aiHint}>
                <Feather name="copy" size={11} color={theme.textSecondary} />
                <Text
                  style={[styles.aiHintText, { color: theme.textSecondary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {i18n.t("copyAndOpen")}
                </Text>
              </View>
            </View>
            <View style={styles.aiGrid}>
              {aiRows.map((row, rowIndex) => (
                <View key={`ai-row-${rowIndex}`} style={styles.aiRow}>
                  {row.map((option, columnIndex) =>
                    option ? (
                      <AIShortcut
                        key={option.key}
                        option={option}
                        onPress={() => launchAI(option)}
                        loading={launchingService === option.key}
                        disabled={launchingService !== null}
                      />
                    ) : (
                      <View
                        key={`ai-placeholder-${columnIndex}`}
                        style={styles.aiPlaceholder}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                      />
                    )
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <View
          style={[
            styles.toolbar,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <DetailAction
            icon="trash-2"
            label={i18n.t("delete")}
            onPress={confirmDelete}
            destructive
            iconOnly
          />
          <DetailAction
            icon="edit-2"
            label={i18n.t("modify")}
            onPress={() => openEditor({ memoId: memo.id })}
            iconOnly
          />
          <View
            style={[styles.actionDivider, { backgroundColor: theme.border }]}
          />
          <DetailAction
            icon={copied ? "check" : "copy"}
            label={i18n.t(copied ? "copied" : "copy")}
            onPress={copyMemo}
            active={copied}
          />
          <DetailAction
            icon="search"
            label={i18n.t("searchAction")}
            onPress={() => dispatchActionSheet({ type: "open" })}
            prominent
          />
        </View>
      </View>

      <MemoActionModal
        visible={actionsVisible}
        closeModal={() => dispatchActionSheet({ type: "close" })}
        selectedMemo={memo}
      />
    </SafeAreaView>
  );
}

function AIShortcut({ option, onPress, loading, disabled }) {
  const { theme } = useTheme();
  const Icon = searchIconMap[option.key];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.aiButton,
        { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
        disabled && !loading && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityHint={i18n.t("copyAndOpen")}
      accessibilityState={{ disabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.primary} />
      ) : (
        <Icon size={26} color={theme.text} />
      )}
      <Text
        style={[styles.aiLabel, { color: theme.text }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {option.shortLabel || option.label}
      </Text>
    </Pressable>
  );
}

function DetailAction({
  icon,
  label,
  onPress,
  destructive = false,
  iconOnly = false,
  prominent = false,
  active = false,
}) {
  const { theme, themeName } = useTheme();
  const labelColor = prominent
    ? theme.primaryText
    : active ? theme.primary : theme.text;
  let foregroundColor = active ? theme.primary : theme.icon;
  if (destructive) {
    foregroundColor = themeName === "dark" ? "#E99087" : "#B45D55";
  } else if (prominent) {
    foregroundColor = theme.primaryText;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.action,
        iconOnly && styles.iconAction,
        prominent && { backgroundColor: theme.addButton },
        active && { backgroundColor: theme.textInputBG },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name={icon} size={19} color={foregroundColor} />
      {!iconOnly && (
        <Text
          style={[
            styles.actionText,
            { color: labelColor },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {label}
        </Text>
      )}
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
    borderBottomWidth: 1,
    paddingHorizontal: 4,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NotoSansKR",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    fontFamily: "NotoSansKR-Regular",
  },
  date: {
    marginTop: 24,
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
  actionDock: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  aiSection: {
    gap: 12,
  },
  aiHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 4,
  },
  aiTitle: {
    fontSize: 12,
    fontFamily: "NotoSansKR",
  },
  aiHint: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 5,
  },
  aiHintText: {
    flexShrink: 1,
    fontSize: 11,
    fontFamily: "NotoSansKR-Regular",
  },
  aiGrid: {
    gap: 8,
  },
  aiRow: {
    flexDirection: "row",
    gap: 8,
  },
  aiPlaceholder: {
    flex: 1,
  },
  aiButton: {
    flex: 1,
    minHeight: 76,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  aiLabel: {
    fontSize: 12,
    fontFamily: "NotoSansKR",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    height: 22,
    marginHorizontal: 2,
  },
  action: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  iconAction: {
    flex: 0,
    width: 44,
    paddingHorizontal: 0,
  },
  actionText: {
    flexShrink: 1,
    fontSize: 13,
    fontFamily: "NotoSansKR",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
