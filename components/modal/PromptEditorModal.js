import React, { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

const EMPTY_EDITOR = {
  id: null,
  title: "",
  body: "",
  tagsText: "",
};

export default function PromptEditorModal({
  visible,
  prompt,
  onClose,
  onSave,
}) {
  const { theme } = useTheme();
  const [editor, setEditor] = useState(EMPTY_EDITOR);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setEditor(
      prompt
        ? {
            id: prompt.id,
            title: prompt.title,
            body: prompt.body,
            tagsText: prompt.tags.join(", "),
          }
        : EMPTY_EDITOR
    );
    setWarning(false);
  }, [prompt, visible]);

  const handleSave = () => {
    if (!editor.body.trim()) {
      setWarning(true);
      return;
    }
    onSave({
      id: editor.id,
      title: editor.title,
      body: editor.body,
      tags: editor.tagsText,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
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
              <Feather name="x" size={22} color={theme.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {i18n.t(prompt ? "editPrompt" : "newPrompt")}
            </Text>
            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel={i18n.t("save")}
            >
              <Text style={[styles.saveText, { color: theme.primary }]}>
                {i18n.t("save")}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.label, { color: theme.text }]}>
              {i18n.t("promptTitle")}
            </Text>
            <TextInput
              value={editor.title}
              onChangeText={(title) =>
                setEditor((current) => ({ ...current, title }))
              }
              style={[
                styles.titleInput,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
              placeholder={i18n.t("promptTitlePlaceholder")}
              placeholderTextColor={theme.textSecondary}
              maxLength={120}
              accessibilityLabel={i18n.t("promptTitle")}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              {i18n.t("promptBody")}
            </Text>
            <TextInput
              value={editor.body}
              onChangeText={(body) => {
                setEditor((current) => ({ ...current, body }));
                if (body.trim()) setWarning(false);
              }}
              style={[
                styles.bodyInput,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: warning ? "#EA4747" : theme.border,
                },
              ]}
              placeholder={i18n.t("promptBodyPlaceholder")}
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              autoFocus={!prompt}
              maxLength={20000}
              accessibilityLabel={i18n.t("promptBody")}
            />
            {warning && (
              <Text style={styles.warning}>{i18n.t("promptBodyWarning")}</Text>
            )}

            <Text style={[styles.label, { color: theme.text }]}>
              {i18n.t("tags")}
            </Text>
            <TextInput
              value={editor.tagsText}
              onChangeText={(tagsText) =>
                setEditor((current) => ({ ...current, tagsText }))
              }
              style={[
                styles.titleInput,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                },
              ]}
              placeholder={i18n.t("tagsPlaceholder")}
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              maxLength={300}
              accessibilityLabel={i18n.t("tags")}
            />
            <Text style={[styles.helper, { color: theme.textSecondary }]}>
              {i18n.t("tagsDescription")}
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NotoSansKR",
  },
  saveButton: {
    minWidth: 52,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 15,
    fontFamily: "NotoSansKR",
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  titleInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "NotoSansKR-Regular",
    marginBottom: 20,
  },
  bodyInput: {
    minHeight: 260,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "NotoSansKR-Regular",
    marginBottom: 5,
  },
  warning: {
    color: "#EA4747",
    fontSize: 12,
    marginBottom: 16,
    fontFamily: "NotoSansKR-Regular",
  },
  helper: {
    marginTop: -13,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "NotoSansKR-Regular",
  },
});
