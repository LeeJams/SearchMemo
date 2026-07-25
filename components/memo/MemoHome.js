import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemos } from "../../hooks/useMemos";
import { useFolders } from "../../hooks/useFolders";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import i18n from "../../locales/i18n";
import MemoList from "./MemoList";
import FolderBar from "./FolderBar";
import EmptyScreen from "../ui/EmptyScreen";
import MemoInputModal from "../modal/MemoInputModal";
import MemoDetailModal from "../modal/MemoDetailModal";
import FolderManagerModal from "../modal/FolderManagerModal";
import RightSheet from "../modal/RightSheet";

const {
  PROMPTS_FOLDER_ID,
  filterMemos,
  mergePromptsIntoMemos,
} = require("../../utill/memoModel");
const {
  INITIAL_MEMO_DETAIL_FLOW,
  memoDetailFlowReducer,
} = require("../../utill/memoDetailFlow");

export default function MemoHome() {
  const { theme } = useTheme();
  const { locale } = useLanguage();
  const {
    memos,
    isInit,
    addMemo,
    updateMemo,
    deleteMemo,
    moveMemosFromFolder,
    replaceMemos,
    storageError,
  } = useMemos();
  const {
    folders,
    isInit: areFoldersInitialized,
    addFolder,
    updateFolder,
    deleteFolder,
    replaceFolders,
    storageError: folderStorageError,
  } = useFolders();

  const [query, setQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("all");
  const [selectedMemoId, setSelectedMemoId] = useState(null);
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memoDetailFlow, dispatchMemoDetailFlow] = useReducer(
    memoDetailFlowReducer,
    INITIAL_MEMO_DETAIL_FLOW
  );
  const { editorVisible, detailVisible } = memoDetailFlow;
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const selectedMemo =
    memos.find((memo) => memo.id === selectedMemoId) || null;
  const editingMemo =
    memos.find((memo) => memo.id === editingMemoId) || null;
  const visibleMemos = useMemo(
    () => filterMemos(memos, { query, folderId: selectedFolderId }),
    [memos, query, selectedFolderId]
  );
  const includePromptsFolder = memos.some(
    (memo) => memo.folderId === PROMPTS_FOLDER_ID
  );

  useEffect(() => {
    if (storageError || folderStorageError) {
      Alert.alert(i18n.t("settings"), i18n.t("storageError"));
    }
  }, [storageError, folderStorageError, locale]);

  const openNewMemo = () => {
    setEditingMemoId(null);
    dispatchMemoDetailFlow({ type: "openEditor" });
  };

  const openDetail = (memo) => {
    setSelectedMemoId(memo.id);
    dispatchMemoDetailFlow({ type: "openDetail" });
  };

  const openEditor = (memo) => {
    setEditingMemoId(memo?.id || null);
    setSelectedMemoId(memo?.id || selectedMemoId);
    dispatchMemoDetailFlow({ type: "openEditor" });
  };

  const saveMemo = (memoData) => {
    if (memoData.id) {
      updateMemo(memoData);
    } else {
      addMemo(memoData);
    }
  };

  const removeMemo = (id = selectedMemoId) => {
    if (id) deleteMemo(id);
    dispatchMemoDetailFlow({ type: "closeAll" });
    setSelectedMemoId(null);
  };

  const removeFolder = (id) => {
    moveMemosFromFolder(id, null);
    deleteFolder(id);
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  const importData = ({
    memos: importedMemos,
    prompts: importedPrompts,
    folders: importedFolders,
  }) => {
    replaceMemos(mergePromptsIntoMemos(importedMemos, importedPrompts));
    replaceFolders(importedFolders || []);
  };

  const defaultFolderId =
    selectedFolderId === "all" ? null : selectedFolderId;
  const initialized = isInit && areFoldersInitialized;
  const emptyMessage = query
    ? i18n.t("noMemoResults")
    : i18n.t("memoEmpty");

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

      <View style={styles.floatingActions}>
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
          onPress={openNewMemo}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("writeMemo")}
        >
          <Feather name="plus" size={19} color={theme.addButtonText} />
          <Text style={[styles.buttonText, { color: theme.addButtonText }]}>
            {i18n.t("writeMemo")}
          </Text>
        </Pressable>
      </View>

      <MemoInputModal
        visible={editorVisible}
        memo={editingMemo}
        folders={folders}
        includePromptsFolder={includePromptsFolder}
        initialFolderId={defaultFolderId}
        onClose={() => {
          dispatchMemoDetailFlow({ type: "closeEditor" });
          setEditingMemoId(null);
        }}
        onSave={saveMemo}
      />
      <MemoDetailModal
        visible={detailVisible}
        memo={selectedMemo}
        onClose={() => dispatchMemoDetailFlow({ type: "closeDetail" })}
        onEdit={openEditor}
        onDelete={removeMemo}
      />
      <FolderManagerModal
        visible={foldersVisible}
        folders={folders}
        memos={memos}
        onAdd={addFolder}
        onRename={updateFolder}
        onDelete={removeFolder}
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
    bottom: 16,
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
