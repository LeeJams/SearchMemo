import { StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../hooks/useTheme";

const {
  getMemoTitle,
  getMemoListContent,
  MEMO_LIST_MAX_LINES,
} = require("../../utill/memoModel");

function MemoItem({ item, openMemo }) {
  const { theme } = useTheme();
  const { text, date, color } = item;
  const listContent = getMemoListContent(text);
  const title = getMemoTitle(listContent);
  const remainingContent = listContent.slice(title.length);

  return (
    <Pressable
      onPress={() => openMemo(item)}
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
        <Text
          style={[styles.memoText, { color: theme.text }]}
          numberOfLines={MEMO_LIST_MAX_LINES}
          ellipsizeMode="tail"
        >
          <Text style={styles.memoTitle}>{title}</Text>
          {remainingContent ? (
            <Text style={{ color: theme.textSecondary }}>
              {remainingContent}
            </Text>
          ) : null}
        </Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {date}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(MemoItem);

const styles = StyleSheet.create({
  memoContainer: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  colorStrip: {
    width: 4,
    alignSelf: "stretch",
  },
  memoContent: {
    flex: 1,
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  memoText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "NotoSansKR-Regular",
  },
  memoTitle: {
    fontFamily: "NotoSansKR",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
});
