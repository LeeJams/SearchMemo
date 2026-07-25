import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

const { PROMPTS_FOLDER_ID } = require("../../utill/memoModel");

export default function FolderBar({
  folders,
  memos,
  selectedFolderId,
  onSelectFolder,
  onManageFolders,
}) {
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const options = useMemo(() => {
    const values = [
      { id: "all", label: i18n.t("all") },
      { id: null, label: i18n.t("memos") },
    ];
    if (memos.some((memo) => memo.folderId === PROMPTS_FOLDER_ID)) {
      values.push({ id: PROMPTS_FOLDER_ID, label: i18n.t("prompts") });
    }
    return [
      ...values,
      ...folders.map((folder) => ({ id: folder.id, label: folder.name })),
    ];
  }, [folders, memos, locale]);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={options}
        keyExtractor={(item) => item.id || "unfiled"}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => {
          const selected = selectedFolderId === item.id;
          return (
            <Pressable
              style={[
                styles.folderChip,
                {
                  backgroundColor: selected
                    ? theme.primary
                    : theme.backgroundSecondary,
                  borderColor: selected ? theme.primary : theme.border,
                },
              ]}
              onPress={() => onSelectFolder(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={item.label}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.folderText,
                  { color: selected ? theme.primaryText : theme.text },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          <Pressable
            style={[
              styles.manageButton,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={onManageFolders}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("manageFolders")}
          >
            <Feather name="folder-plus" size={17} color={theme.icon} />
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
  },
  content: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  folderChip: {
    minHeight: 44,
    maxWidth: 160,
    justifyContent: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 22,
  },
  folderText: {
    fontSize: 13,
    fontFamily: "NotoSansKR",
  },
  manageButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 22,
  },
});
