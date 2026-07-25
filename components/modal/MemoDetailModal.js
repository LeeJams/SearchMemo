import React, { useEffect, useReducer, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";
import MemoActionModal from "./MemoActionModal";

const { getMemoTitle } = require("../../utill/memoModel");
const { memoActionSheetReducer } = require("../../utill/memoDetailFlow");

export default function MemoDetailModal({
  visible,
  memo,
  onClose,
  onEdit,
  onDelete,
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [actionsVisible, dispatchActionSheet] = useReducer(
    memoActionSheetReducer,
    false
  );

  useEffect(() => {
    if (!visible) {
      setCopied(false);
      dispatchActionSheet({ type: "close" });
    }
  }, [visible]);

  if (!memo) {
    return null;
  }

  const copyMemo = async () => {
    await Clipboard.setStringAsync(memo.text);
    setCopied(true);
  };

  const confirmDelete = () => {
    Alert.alert(i18n.t("deleteConfirmTitle"), i18n.t("deleteConfirmMessage"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => onDelete(memo.id),
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={
        actionsVisible
          ? () => dispatchActionSheet({ type: "close" })
          : onClose
      }
    >
      <SafeAreaProvider>
        <View style={styles.modalRoot}>
          <SafeAreaView
            edges={["top", "bottom", "left", "right"]}
            style={[styles.container, { backgroundColor: theme.background }]}
          >
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Pressable
                style={styles.headerButton}
                onPress={onClose}
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
              <Text
                selectable
                style={[styles.date, { color: theme.textSecondary }]}
              >
                {memo.date}
              </Text>
            </ScrollView>

            <View
              style={[
                styles.toolbar,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderTopColor: theme.border,
                },
              ]}
            >
              <DetailAction
                icon="trash-2"
                label={i18n.t("delete")}
                onPress={confirmDelete}
                destructive
              />
              <DetailAction
                icon="edit-2"
                label={i18n.t("modify")}
                onPress={() => onEdit(memo)}
              />
              <DetailAction
                icon={copied ? "check" : "copy"}
                label={i18n.t(copied ? "copied" : "copy")}
                onPress={copyMemo}
              />
              <DetailAction
                icon="search"
                label={i18n.t("searchAction")}
                onPress={() => dispatchActionSheet({ type: "open" })}
              />
            </View>
          </SafeAreaView>
          <MemoActionModal
            visible={actionsVisible}
            closeModal={() => dispatchActionSheet({ type: "close" })}
            selectedMemo={memo}
          />
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

function DetailAction({ icon, label, onPress, destructive = false }) {
  const { theme } = useTheme();
  const foregroundColor = destructive ? "#D14343" : theme.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: theme.textInputBG },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name={icon} size={19} color={foregroundColor} />
      <Text
        style={[
          styles.actionText,
          { color: destructive ? "#D14343" : theme.text },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
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
  toolbar: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  action: {
    flex: 1,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 3,
  },
  actionText: {
    fontSize: 11,
    fontFamily: "NotoSansKR",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
