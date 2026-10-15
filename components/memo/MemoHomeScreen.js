import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import { useMemoStore } from "../../hooks/useMemoStore";
import i18n from "../../locales/i18n";
import MemoList from "./MemoList";
import FolderBar from "./FolderBar";
import EmptyScreen from "../ui/EmptyScreen";
import FolderManagerModal from "../modal/FolderManagerModal";
import RightSheet from "../modal/RightSheet";

const { filterMemos } = require("../../utill/memoModel");
const { buildMemoDetailRoute } = require("../../utill/memoDetailFlow");

export default function MemoHomeScreen({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { locale } = useLanguage();
  const {
    memos,
    folders,
    initialized,
    openEditor,
    addFolder,
    updateFolder,
    removeFolder,
    importData,
  } = useMemoStore();

  const [query, setQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("all");
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const visibleMemos = useMemo(
    () => filterMemos(memos, { query, folderId: selectedFolderId }),
    [memos, query, selectedFolderId]
  );

  const defaultFolderId = selectedFolderId === "all" ? null : selectedFolderId;

  const openDetail = (memo) => {
    const route = buildMemoDetailRoute(memo);
    if (route) navigation.navigate(...route);
  };

  const deleteFolder = (id) => {
    removeFolder(id);
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  const emptyMessage = query ? i18n.t("noMemoResults") : i18n.t("memoEmpty");

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={[styles.appContainer, { backgroundColor: theme.background }]}
    >
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.textInputBG,
            borderColor: theme.border,
          },
        ]}
      >
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={i18n.t("searchMemos")}
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
          returnKeyType="search"
          accessibilityLabel={i18n.t("searchMemos")}
        />
        {query ? (
          <Pressable
            style={styles.clearButton}
            onPress={() => setQuery("")}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("clearSearch")}
          >
            <Feather name="x-circle" size={18} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <FolderBar
        folders={folders}
        memos={memos}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onManageFolders={() => setFoldersVisible(true)}
      />

      <View style={styles.memosContainer}>
        {initialized && visibleMemos.length === 0 ? (
          <EmptyScreen message={emptyMessage} />
        ) : (
          <MemoList
            memos={visibleMemos}
            openMemo={openDetail}
            locale={locale}
          />
        )}
      </View>

      <View style={[styles.floatingActions, { bottom: insets.bottom + 28, right: insets.right + 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
            pressed && styles.pressed,
          ]}
          onPress={() => setSettingsVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("settings")}
        >
          <Feather name="settings" size={20} color={theme.icon} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.addButton },
            pressed && styles.pressed,
          ]}
          onPress={() => openEditor({ folderId: defaultFolderId })}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("writeMemo")}
        >
          <Feather name="plus" size={19} color={theme.addButtonText} />
          <Text style={[styles.buttonText, { color: theme.addButtonText }]}>
            {i18n.t("writeMemo")}
          </Text>
        </Pressable>
      </View>

      <FolderManagerModal
        visible={foldersVisible}
        folders={folders}
        memos={memos}
        onAdd={addFolder}
        onRename={updateFolder}
        onDelete={deleteFolder}
        onClose={() => setFoldersVisible(false)}
      />
      <RightSheet
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        memos={memos}
        folders={folders}
        onImportData={importData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  searchContainer: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingLeft: 12,
    paddingRight: 2,
    borderWidth: 1,
    borderRadius: 11,
  },
  searchInput: {
    flex: 1,
    minHeight: 42,
    fontSize: 14,
    fontFamily: "NotoSansKR-Regular",
  },
  clearButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  memosContainer: {
    flex: 1,
  },
  floatingActions: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingsButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 24,
  },
  addButton: {
    minWidth: 128,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
