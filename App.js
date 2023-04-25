import { useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "./components/main/Main";
import Done from "./components/done/Done";
import MemoInputModal from "./components/memo/MemoInputModal";
import { AntDesign } from "@expo/vector-icons";
import SelectPickerModal from "./components/modal/SelectPickerModal";

const Tab = createBottomTabNavigator();

export default function App() {
  const [memos, setMemos] = useState([]);
  const [savedMemos, setSavedMemos] = useState([]);
  const [selectedMemoId, setSelectedMemoId] = useState(null);
  const [isSelectPickerVisible, setIsSelectPickerVisible] = useState(false);
  const memoInputRef = useRef(null);

  function addMemoHandler(enteredMemo) {
    const date = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    setMemos((currentMemos) => [
      { text: enteredMemo, id: Math.random().toString(), date },
      ...currentMemos,
    ]);
  }

  function deleteMemo(id) {
    setMemos((currentMemos) => {
      return currentMemos.filter((memo) => memo.id !== id);
    });
    closeSelectPickerModal();
  }

  function moveToSavedMemos(id) {
    setSavedMemos((currentMemos) => {
      const memo = memos.find((memo) => memo.id === id);
      return [
        { text: memo.text, id: memo.id, date: memo.date },
        ...currentMemos,
      ];
    });
    deleteMemo(id);
  }

  function openSelectPickerModal(id) {
    setIsSelectPickerVisible(true);
    setSelectedMemoId(id);
  }

  function closeSelectPickerModal() {
    setIsSelectPickerVisible(false);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "black",
        }}
      >
        <Tab.Screen
          name="Main"
          children={() => (
            <Main memos={memos} openSelectPicker={openSelectPickerModal} />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="bars" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Modal"
          component={MemoInputModal}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              memoInputRef.current.openModal();
            },
          }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="pluscircleo" size={30} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Done"
          children={() => <Done courseGoals={savedMemos} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="save" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <MemoInputModal onAddMemo={addMemoHandler} ref={memoInputRef} />
      <SelectPickerModal
        visible={isSelectPickerVisible}
        closeModal={closeSelectPickerModal}
        deleteMemo={deleteMemo}
        moveToSavedMemos={moveToSavedMemos}
        id={selectedMemoId}
      />
    </NavigationContainer>
  );
}
