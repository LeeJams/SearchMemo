import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const btnWidth = Math.floor(Dimensions.get("window").width / 8);

export default AddButton = ({ onClick }) => (
  <TouchableOpacity
    style={styles.addButtonContainer}
    onPress={() => onClick(true)}
  >
    <View style={styles.addButtonItem}>
      <AntDesign name="pluscircle" size={btnWidth} color="#000000bf" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
