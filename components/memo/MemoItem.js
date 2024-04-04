import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";

function MemoItem(props) {
  const { text, date, color } = props.item;

  return (
    <Pressable
      onPress={() => props.openActionModal(props.item)}
      style={({ pressed }) => pressed && styles.pressed}
      android_ripple={{ color: "#878787" }}
    >
      <View style={styles.memoContainer}>
        <Text style={styles.memoText}>{text}</Text>
        <Text style={styles.dateText}>{date}</Text>
        <View
          style={{ ...styles.containerBadge, backgroundColor: color }}
        ></View>
      </View>
    </Pressable>
  );
}

export default MemoItem;

const width = Dimensions.get("window").width - 13;

const styles = StyleSheet.create({
  memoContainer: {
    width: width / 2,
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    elevation: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 2,
  },
  memoText: {
    padding: 10,
    paddingVertical: 15,
    fontSize: 13,
    fontFamily: "NotoSansKR",
  },
  dateText: {
    fontSize: 12,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    color: "#9c9c9ca6",
  },
  pressed: {
    opacity: 0.5,
  },
  containerBadge: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 8,
    height: 8,
    borderRadius: 5,
    zIndex: 1,
  },
});
