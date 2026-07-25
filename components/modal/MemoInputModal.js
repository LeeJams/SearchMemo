import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { colorOptions } from "../../utill/option";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

const {
  DEFAULT_MEMO_COLOR,
  MEMO_MAX_LENGTH,
  PROMPTS_FOLDER_ID,
} = require("../../utill/memoModel");
const {
  createMemoColorPaletteState,
  memoColorPaletteReducer,
} = require("../../utill/memoEditorModel");

export default function MemoInputModal({
  visible,
  memo,
  folders,
  includePromptsFolder,
  initialFolderId,
  onClose,
  onSave,
}) {
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const [text, setText] = useState("");
  const [colorPalette, dispatchColorPalette] = useReducer(
    memoColorPaletteReducer,
    createMemoColorPaletteState(DEFAULT_MEMO_COLOR)
  );
  const [folderId, setFolderId] = useState(null);
  const [warning, setWarning] = useState(false);
  const color = colorPalette.selectedColor;

  useEffect(() => {
    if (!visible) return;
    setText(memo?.text || "");
    dispatchColorPalette({
      type: "reset",
      color: memo?.color || DEFAULT_MEMO_COLOR,
    });
    setFolderId(memo?.folderId ?? initialFolderId ?? null);
    setWarning(false);
  }, [visible, memo, initialFolderId]);

  const folderOptions = useMemo(() => {
    const options = [{ id: null, label: i18n.t("memos") }];
    if (includePromptsFolder || folderId === PROMPTS_FOLDER_ID) {
      options.push({ id: PROMPTS_FOLDER_ID, label: i18n.t("prompts") });
    }
    return [
      ...options,
      ...folders.map((folder) => ({ id: folder.id, label: folder.name })),
    ];
  }, [folders, folderId, includePromptsFolder, locale]);

  const save = () => {
    if (!text.trim()) {
      setWarning(true);
      return;
    }
    onSave({
      ...(memo || {}),
      text,
      color,
      folderId,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top", "bottom", "left", "right"]}
          style={[styles.container, { backgroundColor: theme.background }]}
        >
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Pressable
                style={styles.headerButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={i18n.t("cancel")}
              >
                <Text style={[styles.headerActionText, { color: theme.text }]}>
                  {i18n.t("cancel")}
                </Text>
              </Pressable>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {i18n.t(memo ? "modify" : "writeMemo")}
              </Text>
              <Pressable
                style={styles.headerButton}
                onPress={save}
                accessibilityRole="button"
                accessibilityLabel={i18n.t("save")}
              >
                <Text
                  style={[styles.headerActionText, { color: theme.primary }]}
                >
                  {i18n.t("save")}
                </Text>
              </Pressable>
            </View>

            <View style={styles.editor}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    color: theme.text,
                    borderColor: warning ? "#D64545" : theme.border,
                  },
                ]}
                placeholder={i18n.t("memoPlaceholder")}
                placeholderTextColor={theme.textSecondary}
                onChangeText={(value) => {
                  setText(value);
                  if (value.trim()) setWarning(false);
                }}
                value={text}
                autoCapitalize="sentences"
                autoCorrect
                autoFocus
                multiline
                scrollEnabled
                maxLength={MEMO_MAX_LENGTH}
                textAlignVertical="top"
                accessibilityLabel={i18n.t("memoPlaceholder")}
              />
              <View style={styles.editorMeta}>
                <Text
                  style={[
                    styles.counter,
                    { color: warning ? "#D64545" : theme.textSecondary },
                  ]}
                >
                  {warning
                    ? i18n.t("warning")
                    : `${text.length.toLocaleString()} / ${MEMO_MAX_LENGTH.toLocaleString()}`}
                </Text>
              </View>
            </View>

            <View
              style={[styles.footer, { borderTopColor: theme.border }]}
            >
              {colorPalette.visible ? (
                <View
                  style={[
                    styles.palettePopover,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.paletteHeader}>
                    <Text style={[styles.paletteTitle, { color: theme.text }]}>
                      {i18n.t("memoColor")}
                    </Text>
                    <Pressable
                      style={styles.paletteCloseButton}
                      onPress={() =>
                        dispatchColorPalette({ type: "close" })
                      }
                      accessibilityRole="button"
                      accessibilityLabel={i18n.t("close")}
                    >
                      <Feather
                        name="x"
                        size={18}
                        color={theme.textSecondary}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.paletteColors}>
                    {colorOptions.map((optionColor, index) => (
                      <Pressable
                        key={optionColor}
                        style={[
                          styles.colorButton,
                          {
                            backgroundColor: optionColor,
                            borderColor:
                              color === optionColor
                                ? theme.primary
                                : theme.border,
                            borderWidth: color === optionColor ? 2 : 1,
                          },
                        ]}
                        onPress={() =>
                          dispatchColorPalette({
                            type: "select",
                            color: optionColor,
                          })
                        }
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: color === optionColor,
                        }}
                        accessibilityLabel={`${i18n.t("memoColor")} ${index + 1}`}
                      >
                        {color === optionColor ? (
                          <Feather
                            name="check"
                            size={16}
                            color={theme.text}
                          />
                        ) : null}
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              <View style={styles.footerToolbar}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.folderOptions}
                  style={styles.optionsScroll}
                >
                  {folderOptions.map((option) => {
                    const selected = folderId === option.id;
                    return (
                      <Pressable
                        key={option.id || "unfiled"}
                        style={[
                          styles.folderChip,
                          {
                            backgroundColor: selected
                              ? theme.primary
                              : theme.textInputBG,
                            borderColor: selected
                              ? theme.primary
                              : theme.border,
                          },
                        ]}
                        onPress={() => setFolderId(option.id)}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={option.label}
                      >
                        <Feather
                          name="folder"
                          size={15}
                          color={selected ? theme.primaryText : theme.icon}
                        />
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.folderText,
                            {
                              color: selected
                                ? theme.primaryText
                                : theme.text,
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <Pressable
                  style={({ pressed }) => [
                    styles.paletteButton,
                    {
                      backgroundColor: theme.textInputBG,
                      borderColor: colorPalette.visible
                        ? theme.primary
                        : theme.border,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    dispatchColorPalette({ type: "toggle" })
                  }
                  accessibilityRole="button"
                  accessibilityState={{ expanded: colorPalette.visible }}
                  accessibilityLabel={i18n.t("memoColor")}
                >
                  <View
                    style={[
                      styles.currentColor,
                      {
                        backgroundColor: color,
                        borderColor: theme.border,
                      },
                    ]}
                  />
                  <Feather
                    name={colorPalette.visible ? "chevron-down" : "chevron-up"}
                    size={15}
                    color={theme.icon}
                  />
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
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
    minWidth: 72,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerActionText: {
    fontSize: 15,
    fontFamily: "NotoSansKR",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontFamily: "NotoSansKR",
  },
  editor: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  textInput: {
    flex: 1,
    minHeight: 220,
    padding: 17,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 17,
    lineHeight: 27,
    fontFamily: "NotoSansKR-Regular",
  },
  editorMeta: {
    minHeight: 28,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  counter: {
    fontSize: 11,
    fontVariant: ["tabular-nums"],
    fontFamily: "NotoSansKR-Regular",
  },
  footer: {
    borderTopWidth: 1,
  },
  footerToolbar: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
  },
  optionsScroll: {
    flex: 1,
  },
  folderOptions: {
    alignItems: "center",
    gap: 8,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 8,
  },
  folderChip: {
    minHeight: 42,
    maxWidth: 160,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 21,
  },
  folderText: {
    fontSize: 12,
    fontFamily: "NotoSansKR",
  },
  paletteButton: {
    width: 52,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginRight: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  currentColor: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 11,
  },
  palettePopover: {
    alignSelf: "flex-end",
    width: 286,
    marginTop: 8,
    marginRight: 14,
    paddingHorizontal: 12,
    paddingBottom: 13,
    borderWidth: 1,
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.16)",
  },
  paletteHeader: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
  },
  paletteTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: "NotoSansKR",
  },
  paletteCloseButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -10,
  },
  paletteColors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },
  colorButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
  },
  pressed: {
    opacity: 0.72,
  },
});
