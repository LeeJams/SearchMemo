import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Alert } from "react-native";
import { useMemos } from "./useMemos";
import { useFolders } from "./useFolders";
import { useLanguage } from "./useLanguage";
import i18n from "../locales/i18n";

const {
  PROMPTS_FOLDER_ID,
  mergePromptsIntoMemos,
} = require("../utill/memoModel");
const {
  INITIAL_MEMO_DETAIL_FLOW,
  memoDetailFlowReducer,
} = require("../utill/memoDetailFlow");

const MemoStoreContext = createContext(null);

export function MemoStoreProvider({ children }) {
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

  const [editorFlow, dispatchEditorFlow] = useReducer(
    memoDetailFlowReducer,
    INITIAL_MEMO_DETAIL_FLOW
  );

  useEffect(() => {
    if (storageError || folderStorageError) {
      Alert.alert(i18n.t("settings"), i18n.t("storageError"));
    }
  }, [storageError, folderStorageError, locale]);

  const openEditor = ({ memoId = null, folderId = null } = {}) =>
    dispatchEditorFlow({ type: "openEditor", memoId, folderId });

  const closeEditor = () => dispatchEditorFlow({ type: "closeEditor" });

  const saveMemo = (memoData) => {
    if (memoData.id) {
      updateMemo(memoData);
    } else {
      addMemo(memoData);
    }
  };

  const removeFolder = (id) => {
    moveMemosFromFolder(id, null);
    deleteFolder(id);
  };

  const importData = ({
    memos: importedMemos,
    prompts: importedPrompts,
    folders: importedFolders,
  }) => {
    replaceMemos(mergePromptsIntoMemos(importedMemos, importedPrompts));
    replaceFolders(importedFolders || []);
  };

  const findMemo = (id) => memos.find((memo) => memo.id === id) || null;

  const value = {
    memos,
    folders,
    initialized: isInit && areFoldersInitialized,
    includePromptsFolder: memos.some(
      (memo) => memo.folderId === PROMPTS_FOLDER_ID
    ),
    editorVisible: editorFlow.editorVisible,
    editingMemo: findMemo(editorFlow.editingMemoId),
    editorFolderId: editorFlow.editorFolderId,
    findMemo,
    openEditor,
    closeEditor,
    saveMemo,
    deleteMemo,
    addFolder,
    updateFolder,
    removeFolder,
    importData,
  };

  return (
    <MemoStoreContext.Provider value={value}>
      {children}
    </MemoStoreContext.Provider>
  );
}

export const useMemoStore = () => useContext(MemoStoreContext);
