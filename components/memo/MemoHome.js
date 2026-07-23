import { Alert, StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemoInputModal from "../modal/MemoInputModal";
import MemoActionModal from "../modal/MemoActionModal";
import { useEffect, useRef, useState } from "react";
import MemoList from "./MemoList";
import EmptyScreen from "../ui/EmptyScreen";
import { useMemos } from "../../hooks/useMemos";
import { usePrompts } from "../../hooks/usePrompts";
import { Feather } from "@expo/vector-icons";
import RightSheet from "../modal/RightSheet";
import PromptLibrary from "../prompt/PromptLibrary";
import PromptEditorModal from "../modal/PromptEditorModal";
import PromptDetailModal from "../modal/PromptDetailModal";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

export default function MemoHome() {
  const { theme } = useTheme();
  const {
    memos,
    isInit,
    addMemo,
    updateMemo,
    deleteMemo: deleteMemoHandler,
    storageError,
    replaceMemos,
  } = useMemos();
  const {
    prompts,
    isInit: arePromptsInitialized,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    markUsed,
    storageError: promptStorageError,
    replacePrompts,
  } = usePrompts();
  const [activeLibrary, setActiveLibrary] = useState("memos");
  const [modalState, setModalState] = useState({
    inputVisible: false,
    actionVisible: false,
    selectedMemo: null,
  });
  const [promptModalState, setPromptModalState] = useState({
    editorVisible: false,
    detailVisible: false,
    editingPromptId: null,
    selectedPromptId: null,
  });
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const inputModalRef = useRef(null);
  const selectedPrompt =
    prompts.find(
      (prompt) => prompt.id === promptModalState.selectedPromptId
    ) || null;
  const editingPrompt =
    prompts.find((prompt) => prompt.id === promptModalState.editingPromptId) ||
    null;

  useEffect(() => {
    if (storageError || promptStorageError) {
      Alert.alert(i18n.t("settings"), i18n.t("storageError"));
    }
  }, [storageError, promptStorageError]);

  const openInputModal = () =>
    setModalState((prev) => ({ ...prev, inputVisible: true }));
  const closeInputModal = () =>
    setModalState((prev) => ({ ...prev, inputVisible: false }));

  const openActionModal = (memo) =>
    setModalState({
      actionVisible: true,
      selectedMemo: memo,
      inputVisible: false,
    });
  const closeActionModal = () =>
    setModalState((prev) => ({
      ...prev,
      actionVisible: false,
      selectedMemo: null,
    }));

  const handleDeleteMemo = () => {
    if (modalState.selectedMemo) {
      deleteMemoHandler(modalState.selectedMemo.id);
      closeActionModal();
    }
  };

  const handleModifyMemo = () => {
    if (modalState.selectedMemo) {
      inputModalRef.current.modifyMemoHandler(modalState.selectedMemo);
      closeActionModal();
      openInputModal();
    }
  };

  const openSettings = () => setSettingsVisible(true);
  const closeSettings = () => setSettingsVisible(false);

  const openPromptEditor = (prompt = null) =>
    setPromptModalState((current) => ({
      ...current,
      editorVisible: true,
      detailVisible: false,
      editingPromptId: prompt?.id || null,
    }));

  const closePromptEditor = () =>
    setPromptModalState((current) => ({
      ...current,
      editorVisible: false,
      editingPromptId: null,
    }));

  const openPromptDetail = (prompt) =>
    setPromptModalState((current) => ({
      ...current,
      detailVisible: true,
      selectedPromptId: prompt.id,
    }));

  const closePromptDetail = () =>
    setPromptModalState((current) => ({
      ...current,
      detailVisible: false,
      selectedPromptId: null,
    }));

  const handleSavePrompt = (promptData) => {
    if (promptData.id) {
      updatePrompt(promptData);
    } else {
      addPrompt(promptData);
    }
  };

  const handleImportData = ({ memos: nextMemos, prompts: nextPrompts }) => {
    replaceMemos(nextMemos);
    replacePrompts(nextPrompts);
  };

  const isPromptLibrary = activeLibrary === "prompts";

  return (
    <SafeAreaView
      style={[styles.appContainer, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          MemoFind
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
            pressed && styles.pressed,
          ]}
          onPress={openSettings}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("settings")}
        >
          <Feather name="settings" size={18} color={theme.icon} />
        </Pressable>
      </View>

      <View
        style={[
          styles.librarySwitch,
          {
            backgroundColor: theme.textInputBG,
            borderColor: theme.border,
          },
        ]}
        accessibilityRole="tablist"
      >
        {["memos", "prompts"].map((library) => {
          const selected = activeLibrary === library;
          return (
            <Pressable
              key={library}
              style={[
                styles.libraryTab,
                selected && { backgroundColor: theme.backgroundSecondary },
              ]}
              onPress={() => setActiveLibrary(library)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={i18n.t(library)}
            >
              <Text
                style={[
                  styles.libraryTabText,
                  { color: selected ? theme.text : theme.textSecondary },
                ]}
              >
                {i18n.t(library)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={[styles.memosContainer, { backgroundColor: theme.background }]}
      >
        {isPromptLibrary ? (
          <PromptLibrary
            prompts={prompts}
            isInit={arePromptsInitialized}
            onOpen={openPromptDetail}
            onToggleFavorite={toggleFavorite}
            onMarkUsed={markUsed}
          />
        ) : memos.length === 0 && isInit ? (
          <EmptyScreen />
        ) : (
          <MemoList memos={memos} openModal={openActionModal} />
        )}
      </View>

      <View style={styles.floatingButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.addButton },
            pressed && styles.pressed,
          ]}
          onPress={
            isPromptLibrary ? () => openPromptEditor() : openInputModal
          }
          accessibilityRole="button"
          accessibilityLabel={i18n.t(
            isPromptLibrary ? "newPrompt" : "writeMemo"
          )}
        >
          <Feather name="plus" size={18} color={theme.addButtonText} />
          <Text style={[styles.buttonText, { color: theme.addButtonText }]}>
            {i18n.t(isPromptLibrary ? "newPrompt" : "writeMemo")}
          </Text>
        </Pressable>
      </View>

      <MemoInputModal
        visible={modalState.inputVisible}
        closeModal={closeInputModal}
        addMemo={addMemo}
        modifyMemo={updateMemo}
        ref={inputModalRef}
      />
      <MemoActionModal
        visible={modalState.actionVisible}
        closeModal={closeActionModal}
        deleteMemo={handleDeleteMemo}
        modifyMemo={handleModifyMemo}
        selectedMemo={modalState.selectedMemo}
      />
      <PromptEditorModal
        visible={promptModalState.editorVisible}
        prompt={editingPrompt}
        onClose={closePromptEditor}
        onSave={handleSavePrompt}
      />
      <PromptDetailModal
        visible={promptModalState.detailVisible}
        prompt={selectedPrompt}
        onClose={closePromptDetail}
        onEdit={openPromptEditor}
        onDelete={deletePrompt}
        onToggleFavorite={toggleFavorite}
        onMarkUsed={markUsed}
      />
      <RightSheet
        visible={isSettingsVisible}
        onClose={closeSettings}
        memos={memos}
        prompts={prompts}
        onImportData={handleImportData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "NotoSansKR",
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  librarySwitch: {
    minHeight: 50,
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 3,
    borderWidth: 1,
    borderRadius: 10,
  },
  libraryTab: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  libraryTabText: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  memosContainer: {
    flex: 1,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 24,
    right: 20,
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 132,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NotoSansKR-Medium",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
