import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "./components/main/Main";
import MemoInput from "./components/memo/MemoInput";
import { AntDesign } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [courseGoals, setCourseGoals] = useState([]);

  function openInputModal() {
    setModalIsVisible(true);
  }

  function closeModalHandler() {
    setModalIsVisible(false);
  }

  function addMemoHandler(enteredGoalText) {
    const date = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    setCourseGoals((currentCourseGoals) => [
      { text: enteredGoalText, id: Math.random().toString(), date },
      ...currentCourseGoals,
    ]);
    closeModalHandler();
  }

  function doneMemoHandler(id) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.id !== id);
    });
  }

  return (
    <>
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
              <Main
                courseGoals={courseGoals}
                doneMemoHandler={doneMemoHandler}
              />
            )}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="bars" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Add"
            component={MemoInput}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                openInputModal();
              },
            }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="pluscircleo" size={30} color="black" />
              ),
            }}
          />
          <Tab.Screen
            name="tetst"
            children={() => <Main courseGoals={courseGoals} />}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="save" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        <MemoInput
          visible={modalIsVisible}
          onAddGoal={addMemoHandler}
          onCancel={closeModalHandler}
        />
      </NavigationContainer>
    </>
  );
}
