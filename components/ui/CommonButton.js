import { View, Text, Pressable, StyleSheet } from "react-native";

export default CommonButton = ({ children, onPress, name }) => {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : [
                styles.buttonInnerContainer,
                name === "add" ? styles.add : styles.cancel,
              ]
        }
        onPress={onPress}
        android_ripple={{ color: "#878787" }}
      >
        <Text
          style={[
            styles.buttonText,
            name === "add" ? styles.add : styles.cancel,
          ]}
        >
          {children}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 20,
    marginHorizontal: 20,
    overflow: "hidden",
    width: "33%",
  },
  buttonInnerContainer: {
    elevation: 2,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "#e1e1e3",
    borderWidth: 1,
    borderRadius: 20,
    fontFamily: "NotoSansKR",
  },
  pressed: {
    opacity: 0.75,
  },
  add: {
    backgroundColor: "#e1e1e3",
    color: "#000",
  },
  cancel: {
    backgroundColor: "#fff",
    color: "#000",
  },
});
