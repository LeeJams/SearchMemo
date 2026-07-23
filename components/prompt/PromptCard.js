import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

function PromptCard({
  prompt,
  onOpen,
  onCopy,
  onToggleFavorite,
  copied,
}) {
  const { theme } = useTheme();
  const formattedDate = new Date(prompt.updatedAt).toLocaleDateString(
    i18n.locale
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSecondary,
          borderColor: theme.border,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.content,
          pressed && { backgroundColor: theme.textInputBG },
        ]}
        onPress={() => onOpen(prompt)}
        accessibilityRole="button"
        accessibilityLabel={`${prompt.title}. ${prompt.body}`}
      >
        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={1}
        >
          {prompt.title}
        </Text>
        <Text
          style={[styles.body, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {prompt.body}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formattedDate}
          </Text>
          {prompt.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: theme.textInputBG }]}
            >
              <Text style={[styles.tagText, { color: theme.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>

      <View style={[styles.actions, { borderLeftColor: theme.border }]}>
        <Pressable
          style={styles.iconButton}
          onPress={() => onToggleFavorite(prompt.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ selected: prompt.favorite }}
          accessibilityLabel={i18n.t(
            prompt.favorite ? "removeFavorite" : "addFavorite"
          )}
        >
          <Feather
            name="star"
            size={19}
            color={prompt.favorite ? "#E5A50A" : theme.textSecondary}
            fill={prompt.favorite ? "#E5A50A" : "transparent"}
          />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => onCopy(prompt)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("copyPrompt")}
        >
          <Feather
            name={copied ? "check" : "copy"}
            size={19}
            color={copied ? theme.primary : theme.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(PromptCard);

const styles = StyleSheet.create({
  container: {
    minHeight: 132,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "NotoSansKR",
  },
  body: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "NotoSansKR-Regular",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  date: {
    fontSize: 11,
    fontFamily: "NotoSansKR-Regular",
  },
  tag: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "NotoSansKR-Regular",
  },
  actions: {
    width: 52,
    justifyContent: "space-around",
    alignItems: "center",
    borderLeftWidth: 1,
    paddingVertical: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
