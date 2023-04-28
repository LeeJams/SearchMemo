import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MemoList from "../memo/MemoList";
import Done from "../done/Done";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRef } from "react";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ children, onPress }) => (
  <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
    <View style={styles.addButtonItem}>{children}</View>
  </TouchableOpacity>
);

export default BottomTabs = () => {
  const memoRef = useRef(null);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="MemoList"
        children={() => <MemoList ref={memoRef} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={MemoList}
        options={{
          tabBarIcon: () => (
            <AntDesign name="pluscircle" size={45} color="#0a62e6" />
          ),
          tabBarButton: (props) => <CustomTabBar {...props} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            memoRef.current.openMemoInputModal();
          },
        }}
      />
      <Tab.Screen
        name="Done"
        component={Done}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="save" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonItem: {
    width: 50,
    height: 50,
    borderRadius: 35,
  },
});
