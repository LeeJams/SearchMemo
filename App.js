import { useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "./components/main/Main";
import Done from "./components/done/Done";
import MemoInputModal from "./components/memo/MemoInputModal";
import { AntDesign } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  const [memos, setMemo] = useState([]);
  const memoInputRef = useRef(null);

  function addMemoHandler(enteredMemo) {
    const date = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    setMemo((currentMemos) => [
      { text: enteredMemo, id: Math.random().toString(), date },
      ...currentMemos,
    ]);
  }

  function doneMemoHandler(id) {
    setMemo((currentMemos) => {
      return currentMemos.filter((memo) => memo.id !== id);
    });
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
            <Main memos={memos} doneMemoHandler={doneMemoHandler} />
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
          children={() => <Done courseGoals={[]} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="save" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <MemoInputModal
        onAddMemo={addMemoHandler}
        ref={memoInputRef}
      />
    </NavigationContainer>
  );
}
