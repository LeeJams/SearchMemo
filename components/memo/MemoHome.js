import { StyleSheet, View, Platform, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemoInputModal from "../modal/MemoInputModal";
import MemoActionModal from "../modal/MemoActionModal";
import { useRef, useState } from "react";
import MemoList from "./MemoList";
import EmptyScreen from "../ui/EmptyScreen";
import { useMemos } from "../../hooks/useMemos";
import { Feather, AntDesign } from "@expo/vector-icons";
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
  } = useMemos();
  const [modalState, setModalState] = useState({
    inputVisible: false,
    actionVisible: false,
    selectedMemo: null,
  });
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const inputModalRef = useRef(null);

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
      <View
        style={[styles.memosContainer, { backgroundColor: theme.background }]}
      >
        {memos.length === 0 && isInit ? (
          <EmptyScreen />
        ) : (
          <MemoList memos={memos} openModal={openActionModal} />
        )}
      </View>

      {/* 플로팅 버튼 컨테이너 */}
      <View style={styles.floatingButtonContainer}>
        {/* 메모 작성 버튼 (길게) */}
        <Pressable
          style={({ pressed }) => [
            styles.addButtonLong,
            { backgroundColor: theme.addButton },
            pressed && styles.pressed,
          ]}
          onPress={openInputModal}
        >
          <AntDesign name="plus" size={18} color={theme.addButtonText} />
          <Text style={[styles.buttonText, { color: theme.addButtonText }]}>
            {i18n.t("writeMemo")}
          </Text>
        </Pressable>

        {/* 설정 버튼 (작게) */}
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            { backgroundColor: theme.backgroundSecondary },
            pressed && styles.pressed,
          ]}
          onPress={openSettings}
        >
          <Feather name="settings" size={16} color={theme.icon} />
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
  memosContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButtonLong: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NotoSansKR-Medium",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
