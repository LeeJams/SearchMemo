import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";

import MemoItem from "./MemoItem";
import MemoInputModal from "../modal/MemoInputModal";
import SelectPickerModal from "../modal/SelectPickerModal";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export default MemoList = forwardRef((props, ref) => {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isSelectPickerVisible, setIsSelectPickerVisible] = useState(false);
  const inputModalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    openMemoInputModal,
  }));

  function openMemoInputModal() {
    setModalIsVisible(true);
  }
  function closeMemoInputModal() {
    setModalIsVisible(false);
  }

  function addMemoHandler(enteredMemo, selecteColor) {
    const date = new Date()
      .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
      .substring(0, 10);
    setMemos((currentMemos) => [
      { text: enteredMemo, id: Math.random().toString(), date, color: selecteColor },
      ...currentMemos,
    ]);
  }

  function modifyMemoHandler(enteredMemo, id, selecteColor) {
    const date = new Date()
      .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
      .substring(0, 10);
    setMemos((currentMemos) => {
      const memo = currentMemos.find((memo) => memo.id === id);
      memo.text = enteredMemo;
      memo.date = date;
      memo.color = selecteColor;
      return [...currentMemos];
    });
  }

  function selectDeleteMemo(id) {
    setMemos((currentMemos) => {
      return currentMemos.filter((memo) => memo.id !== id);
    });
    closeSelectPickerModal();
  }

  function selectModifyMemo(memo) {
    inputModalRef.current.modifyMemoHandler(memo);
    openMemoInputModal();
    closeSelectPickerModal();
  }

  function openSelectPickerModal(memo) {
    setIsSelectPickerVisible(true);
    setSelectedMemo(memo);
  }

  function closeSelectPickerModal() {
    setIsSelectPickerVisible(false);
  }

  const leftMemos = memos.filter((memo, idx) => (idx + 1) % 2 === 1);
  const rightMemos = memos.filter((memo, idx) => (idx + 1) % 2 === 0);

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.memosContainer}>
        <FlatList
          data={leftMemos}
          style={styles.memoListContainer}
          renderItem={(itemData) => {
            return (
              <MemoItem
                item={itemData.item}
                openSelectPicker={openSelectPickerModal}
              />
            );
          }}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          alwaysBounceVertical={false}
        />
        <FlatList
          data={rightMemos}
          style={styles.memoListContainer}
          renderItem={(itemData) => {
            return (
              <MemoItem
                item={itemData.item}
                openSelectPicker={openSelectPickerModal}
              />
            );
          }}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          alwaysBounceVertical={false}
        />
      </View>
      <MemoInputModal
        modalIsVisible={modalIsVisible}
        closeModal={closeMemoInputModal}
        addMemo={addMemoHandler}
        modifyMemo={modifyMemoHandler}
        ref={inputModalRef}
      />
      <SelectPickerModal
        visible={isSelectPickerVisible}
        closeModal={closeSelectPickerModal}
        deleteMemo={selectDeleteMemo}
        modifyMemo={selectModifyMemo}
        selectedMemo={selectedMemo}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  memosContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  memoListContainer: {
    flex: 1,
  },
});
