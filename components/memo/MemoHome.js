import { StyleSheet, View, SafeAreaView } from "react-native";
import MemoInputModal from "../modal/MemoInputModal";
import SelectPickerModal from "../modal/SelectPickerModal";
import { useRef, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MemoList from "./MemoList";
import AddButton from "./AddButton";
import EmptyScreen from "./EmptyScreen";

export default MemoHome = () => {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isSelectPickerVisible, setIsSelectPickerVisible] = useState(false);
  const [isInitSetting, setIsInitSetting] = useState(false);
  const inputModalRef = useRef(null);

  useEffect(() => {
    const getMemos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("memos");
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log(e);
      }
    };
    getMemos().then((memos) => {
      if (memos.length) {
        setMemos(memos);
      }
      setIsInitSetting(true);
    });
  }, []);

  useEffect(() => {
    storeMemos();
  }, [memos]);

  const storeMemos = async () => {
    try {
      const jsonValue = JSON.stringify(memos);
      await AsyncStorage.setItem("memos", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

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
        id: currentMemos.length + 1,
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
        {memos.length === 0 && isInitSetting ? (
          <EmptyScreen />
        ) : (
          <MemoList memos={memos} openModal={openSelectPickerModal} />
        )}
      </View>
      <AddButton onClick={openMemoInputModal} />
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
});
