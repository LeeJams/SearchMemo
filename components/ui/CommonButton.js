import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";

function CommonButton({ children, onPress, style, textStyle }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: "#878787" }}
    >
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </Pressable>
  );
}

export default React.memo(CommonButton);

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    marginHorizontal: 20,
    overflow: "hidden",
    width: "33%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e1e1e3",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontFamily: "NotoSansKR",
  },
  pressed: {
    opacity: 0.75,
  },
});
