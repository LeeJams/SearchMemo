import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";

function CommonButton({ children, onPress, style, textStyle, accessibilityLabel }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: "#878787" }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || String(children)}
    >
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </Pressable>
  );
}

export default React.memo(CommonButton);

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e1e1e3",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontFamily: "NotoSansKR",
  },
  pressed: {
    opacity: 0.75,
  },
});
