import { StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { Feather } from "@expo/vector-icons";

function MemoItem({ item, openActionModal }) {
  const { theme } = useTheme();
  const { text, date, color } = item;

  return (
    <Pressable
      onPress={() => openActionModal(item)}
      style={({ pressed }) => [
        styles.memoContainer,
        {
          backgroundColor: pressed
            ? theme.textInputBG
            : theme.backgroundSecondary,
          borderColor: theme.border,
        },
      ]}
      android_ripple={{ color: theme.textSecondary }}
      accessibilityRole="button"
      accessibilityLabel={`${text} ${date}`}
    >
      <View style={[styles.colorStrip, { backgroundColor: color }]} />
      <View style={styles.memoContent}>
        <Text style={[styles.memoText, { color: theme.text }]}>{text}</Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {date}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        <Feather name="chevron-right" size={18} color={theme.textSecondary} />
      </View>
    </Pressable>
  );
}

export default React.memo(MemoItem);

const styles = StyleSheet.create({
  memoContainer: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    overflow: "hidden",
  },
  colorStrip: {
    width: 4,
    alignSelf: "stretch",
  },
  memoContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  memoText: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "NotoSansKR-Regular",
  },
  dateText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
  chevronContainer: {
    paddingLeft: 4,
    paddingRight: 14,
  },
});
