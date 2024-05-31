import { StyleSheet, View, SafeAreaView, Platform } from "react-native";
import MemoInputModal from "../modal/MemoInputModal";
import MemoActionModal from "../modal/MemoActionModal";
import { useRef, useState, useEffect } from "react";
import MemoList from "./MemoList";
import AddButton from "../ui/AddButton";
import EmptyScreen from "../ui/EmptyScreen";
import { getCurrentDate, getMemos, storeMemos } from "../../utill/memo";

export default MemoHome = () => {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isSelectPickerVisible, setIsSelectPickerVisible] = useState(false);
  const [isInitSetting, setIsInitSetting] = useState(false);
  const inputModalRef = useRef(null);

  useEffect(() => {
    getMemos().then((memos) => {
      if (memos?.length) {
        setMemos(memos);
      }
      setIsInitSetting(true);
    });
  }, []);

  useEffect(() => {
    storeMemos(memos);
  }, [memos]);

  function openMemoInputModal() {
    setIsInputVisible(true);
  }

  function closeMemoInputModal() {
    setIsInputVisible(false);
  }

  function openMemoActionModal(memo) {
    setIsSelectPickerVisible(true);
    setSelectedMemo(memo);
  }

  function closeSelectPickerModal() {
    setIsSelectPickerVisible(false);
  }

  function addMemoHandler(memoData) {
    setMemos((currentMemos) => [
      {
        text: memoData.text.trim(),
        id: Date.now(),
        date: getCurrentDate(),
        color: memoData.color,
      },
      ...currentMemos,
    ]);
  }

  function modifyMemoHandler(memoData) {
    setMemos((currentMemos) => {
      return currentMemos.map((memo) => {
        if (memo.id === memoData.id) {
          return {
            id: memo.id,
            text: memoData.text.trim(),
            date: getCurrentDate(),
            color: memoData.color,
          };
        } else {
          return memo;
        }
      });
    });
  }

  function deleteMemo(id) {
    setMemos((currentMemos) => {
      return currentMemos.filter((memo) => memo.id !== id);
    });
    closeSelectPickerModal();
  }

  function modifyMemo(memo) {
    inputModalRef.current.modifyMemoHandler(memo);
    openMemoInputModal();
    closeSelectPickerModal();
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.memosContainer}>
        {memos.length === 0 && isInitSetting ? (
          <EmptyScreen />
        ) : (
          <MemoList memos={memos} openModal={openMemoActionModal} />
        )}
      </View>
      <AddButton onClick={openMemoInputModal} />
      <MemoInputModal
        visible={isInputVisible}
        closeModal={closeMemoInputModal}
        addMemo={addMemoHandler}
        modifyMemo={modifyMemoHandler}
        ref={inputModalRef}
      />
      <MemoActionModal
        visible={isSelectPickerVisible}
        closeModal={closeSelectPickerModal}
        deleteMemo={deleteMemo}
        modifyMemo={modifyMemo}
        selectedMemo={selectedMemo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 45 : 0,
    backgroundColor: "#e8e8e8",
  },
  memosContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
  },
  memoListContainer: {
    flex: 1,
  },
});
