import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

const { isFolderNameAvailable } = require("../../utill/folderModel");

export default function FolderManagerModal({
  visible,
  folders,
  memos,
  onAdd,
  onRename,
  onDelete,
  onClose,
}) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) {
      setName("");
      setEditingId(null);
      setError("");
    }
  }, [visible]);

  const counts = useMemo(() => {
    const result = new Map();
    memos.forEach((memo) => {
      if (memo.folderId) {
        result.set(memo.folderId, (result.get(memo.folderId) || 0) + 1);
      }
    });
    return result;
  }, [memos]);

  const submit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(i18n.t("folderNameRequired"));
      return;
    }
    if (!isFolderNameAvailable(folders, trimmedName, editingId)) {
      setError(i18n.t("folderNameDuplicate"));
      return;
    }
    if (editingId) {
      onRename(editingId, trimmedName);
    } else {
      onAdd(trimmedName);
    }
    setName("");
    setEditingId(null);
    setError("");
  };

  const startRename = (folder) => {
    setEditingId(folder.id);
    setName(folder.name);
    setError("");
  };

  const confirmDelete = (folder) => {
    Alert.alert(
      i18n.t("deleteFolderTitle"),
      i18n.t("deleteFolderMessage"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => onDelete(folder.id),
        },
      ]
    );
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
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Pressable
                style={styles.headerButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={i18n.t("close")}
              >
                <Feather name="x" size={22} color={theme.text} />
              </Pressable>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {i18n.t("manageFolders")}
              </Text>
              <View style={styles.headerButton} />
            </View>

            <View style={styles.form}>
              <TextInput
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (error) setError("");
                }}
                placeholder={i18n.t("folderName")}
                placeholderTextColor={theme.textSecondary}
                maxLength={60}
                returnKeyType="done"
                onSubmitEditing={submit}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.textInputBG,
                    borderColor: error ? "#D64545" : theme.border,
                    color: theme.text,
                  },
                ]}
                accessibilityLabel={i18n.t("folderName")}
              />
              <Pressable
                style={[styles.submit, { backgroundColor: theme.primary }]}
                onPress={submit}
                accessibilityRole="button"
                accessibilityLabel={i18n.t(editingId ? "rename" : "newFolder")}
              >
                <Text style={[styles.submitText, { color: theme.primaryText }]}>
                  {i18n.t(editingId ? "rename" : "add")}
                </Text>
              </Pressable>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              contentInsetAdjustmentBehavior="automatic"
              ListEmptyComponent={
                <Text style={[styles.empty, { color: theme.textSecondary }]}>
                  {i18n.t("folderEmpty")}
                </Text>
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.folderRow,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.folderInfo}>
                    <Feather name="folder" size={20} color={theme.primary} />
                    <View style={styles.folderText}>
                      <Text
                        style={[styles.folderName, { color: theme.text }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.folderCount,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {i18n.t("memoCount", {
                          count: counts.get(item.id) || 0,
                        })}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.rowButton}
                    onPress={() => startRename(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${i18n.t("rename")} ${item.name}`}
                  >
                    <Feather name="edit-2" size={18} color={theme.icon} />
                  </Pressable>
                  <Pressable
                    style={styles.rowButton}
                    onPress={() => confirmDelete(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${i18n.t("delete")} ${item.name}`}
                  >
                    <Feather name="trash-2" size={18} color="#D64545" />
                  </Pressable>
                </View>
              )}
            />
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
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NotoSansKR",
  },
  form: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "NotoSansKR-Regular",
  },
  submit: {
    minWidth: 72,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  submitText: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  error: {
    color: "#D64545",
    paddingHorizontal: 18,
    paddingTop: 7,
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
  list: {
    gap: 8,
    padding: 16,
    paddingBottom: 28,
  },
  folderRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 4,
    borderWidth: 1,
    borderRadius: 10,
  },
  folderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  folderText: {
    flex: 1,
  },
  folderName: {
    fontSize: 15,
    fontFamily: "NotoSansKR",
  },
  folderCount: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
  rowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    paddingVertical: 48,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "NotoSansKR-Regular",
  },
});
