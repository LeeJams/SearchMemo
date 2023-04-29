import { StyleSheet, View, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import MemoItem from "./MemoItem";
import MemoInputModal from "../modal/MemoInputModal";
import SelectPickerModal from "../modal/SelectPickerModal";
import { AntDesign } from "@expo/vector-icons";
import { useRef, useState } from "react";

const btnWidth = Math.floor(Dimensions.get("window").width / 8);

export default MemoList = (props) => {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isSelectPickerVisible, setIsSelectPickerVisible] = useState(false);
  const inputModalRef = useRef(null);

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
      {
        text: enteredMemo,
        id: Math.random().toString(),
        date,
        color: selecteColor,
      },
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

  

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.memosContainer}>
        <FlatList
          data={memos}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 4,
          }}
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
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => setModalIsVisible(true)}
      >
        <View style={styles.addButtonItem}>
          <AntDesign name="pluscircle" size={btnWidth} color="#0a62e6" />
        </View>
      </TouchableOpacity>
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
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
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
  addButtonContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonItem: {
    width: btnWidth,
    height: btnWidth,
    borderRadius: 35,
  },
});
