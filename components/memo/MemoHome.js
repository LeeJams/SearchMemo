import { Alert, StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemoInputModal from "../modal/MemoInputModal";
import MemoActionModal from "../modal/MemoActionModal";
import { useEffect, useRef, useState } from "react";
import MemoList from "./MemoList";
import EmptyScreen from "../ui/EmptyScreen";
import { useMemos } from "../../hooks/useMemos";
import { Feather } from "@expo/vector-icons";
import RightSheet from "../modal/RightSheet";
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
  } = useMemos();
  const [modalState, setModalState] = useState({
    inputVisible: false,
    actionVisible: false,
    selectedMemo: null,
  });
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const inputModalRef = useRef(null);

  useEffect(() => {
    if (storageError) {
      Alert.alert(i18n.t("settings"), i18n.t("storageError"));
    }
  }, [storageError]);

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

  return (
    <SafeAreaView
      style={[styles.appContainer, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {i18n.t("search")}
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
        style={[styles.memosContainer, { backgroundColor: theme.background }]}
      >
        {memos.length === 0 && isInit ? (
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
          onPress={openInputModal}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("writeMemo")}
        >
          <Feather name="plus" size={18} color={theme.addButtonText} />
          <Text style={[styles.buttonText, { color: theme.addButtonText }]}>
            {i18n.t("writeMemo")}
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
      <RightSheet visible={isSettingsVisible} onClose={closeSettings} />
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
