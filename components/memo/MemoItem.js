import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useTheme } from "../../hooks/useTheme";

function MemoItem({ item, openActionModal }) {
  const { theme } = useTheme();
  const { text, date, color } = item;
  const { width } = useWindowDimensions();
  const memoWidth = (width - 13) / 2;

  return (
    <Pressable
      onPress={() => openActionModal(item)}
      style={({ pressed }) => pressed && styles.pressed}
      android_ripple={{ color: theme.textSecondary }}
    >
      <View
        style={[
          styles.memoContainer,
          {
            width: memoWidth,
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.memoText, { color: theme.text }]}>{text}</Text>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {date}
        </Text>
        <View style={[styles.containerBadge, { backgroundColor: color }]} />
      </View>
    </Pressable>
  );
}

export default React.memo(MemoItem);

const styles = StyleSheet.create({
  memoContainer: {
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 1,
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
