import { StyleSheet, View, Text, Linking, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import { AntDesign } from "@expo/vector-icons";

function MemoItem(props) {
  const { id, text, date } = props.item;
  return (
    <Pressable
      onPress={() => props.openSelectPicker(props.item)}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.memoContainer}>
        {/* <View style={styles.containerBadge}></View> */}
        <Text style={styles.memoText}>{text}</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default MemoItem;

const styles = StyleSheet.create({
  memoContainer: {
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 5,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  memoText: {
    padding: 10,
    fontSize: 15,
  },
  dateBox: {
    borderTopWidth: 0.7,
    borderTopColor: "#878787",
  },
  dateText: {
    fontSize: 12,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
  },
  pressed: {
    opacity: 0.5,
  },
  containerBadge: {
    position: "absolute",
    backgroundColor: "#5bbfc8",
    width: 8,
    height: 8,
    borderRadius: 5,
    zIndex: 1,
  },
});
