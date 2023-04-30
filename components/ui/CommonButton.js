import { View, Text, Pressable, StyleSheet } from "react-native";

export default CommonButton = ({ children, onPress }) => {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: "#474747" }}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 20,
    marginHorizontal: 20,
    backgroundColor: "#cccccc",
    overflow: "hidden",
    width: "30%",
  },
  buttonInnerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: 500,
    color: "#242424",
  },
  pressed: {
    opacity: 0.75,
  },
});
