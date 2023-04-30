import { StyleSheet, Text, View } from "react-native";

export default EmptyScreen = () => {
  return (
    <View style={styles.emptyScreenContainer}>
      <Text style={styles.emptyScreenText}>메모를 추가해주세요.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyScreenText: {
    fontSize: 20,
    color: "#000000bf",
  },
});