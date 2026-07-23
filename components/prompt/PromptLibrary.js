import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import PromptCard from "./PromptCard";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

const {
  filterAndSortPrompts,
  getPromptTags,
} = require("../../utill/promptModel");

export default function PromptLibrary({
  prompts,
  isInit,
  onOpen,
  onToggleFavorite,
  onMarkUsed,
}) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const copyTimer = useRef(null);

  useEffect(
    () => () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    },
    []
  );

  const tags = useMemo(() => getPromptTags(prompts), [prompts]);
  const visiblePrompts = useMemo(
    () =>
      filterAndSortPrompts(prompts, {
        query,
        tag: selectedTag,
        favoritesOnly,
      }),
    [prompts, query, selectedTag, favoritesOnly]
  );

  const handleCopy = useCallback(
    async (prompt) => {
      await Clipboard.setStringAsync(prompt.body);
      onMarkUsed(prompt.id);
      setCopiedId(prompt.id);
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
      copyTimer.current = setTimeout(() => setCopiedId(null), 1500);
    },
    [onMarkUsed]
  );

  const renderPrompt = useCallback(
    ({ item }) => (
      <PromptCard
        prompt={item}
        onOpen={onOpen}
        onCopy={handleCopy}
        onToggleFavorite={onToggleFavorite}
        copied={copiedId === item.id}
      />
    ),
    [copiedId, handleCopy, onOpen, onToggleFavorite]
  );

  const hasFilters = query.trim() || selectedTag || favoritesOnly;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={i18n.t("searchPrompts")}
          placeholderTextColor={theme.textSecondary}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={i18n.t("searchPrompts")}
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            style={styles.searchClearButton}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("clearSearch")}
          >
            <Feather name="x" size={18} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        style={styles.filterScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <FilterChip
          label={i18n.t("favorites")}
          selected={favoritesOnly}
          icon="star"
          onPress={() => setFavoritesOnly((value) => !value)}
        />
        <FilterChip
          label={i18n.t("all")}
          selected={!selectedTag}
          onPress={() => setSelectedTag(null)}
        />
        {tags.map((tag) => (
          <FilterChip
            key={tag}
            label={tag}
            selected={selectedTag === tag}
            onPress={() =>
              setSelectedTag((currentTag) =>
                currentTag === tag ? null : tag
              )
            }
          />
        ))}
      </ScrollView>

      {visiblePrompts.length > 0 ? (
        <FlatList
          data={visiblePrompts}
          renderItem={renderPrompt}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather
              name={hasFilters ? "search" : "terminal"}
              size={28}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {isInit
              ? i18n.t(hasFilters ? "noPromptResults" : "promptEmpty")
              : i18n.t("loading")}
          </Text>
          {!hasFilters && isInit && (
            <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
              {i18n.t("promptEmptyDescription")}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

function FilterChip({ label, selected, icon, onPress }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: selected ? theme.primary : theme.backgroundSecondary,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      {icon && (
        <Feather
          name={icon}
          size={14}
          color={selected ? theme.primaryText : theme.textSecondary}
        />
      )}
      <Text
        style={[
          styles.filterText,
          { color: selected ? theme.primaryText : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: "NotoSansKR-Regular",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  searchClearButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  filters: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 7,
  },
  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterChip: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 22,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "NotoSansKR",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 92,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    textAlign: "center",
    fontFamily: "NotoSansKR",
  },
  emptyDescription: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    fontFamily: "NotoSansKR-Regular",
  },
});
