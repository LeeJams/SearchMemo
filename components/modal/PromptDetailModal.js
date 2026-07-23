import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { getSelectedAIOptions } from "../../utill/option";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

export default function PromptDetailModal({
  visible,
  prompt,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMarkUsed,
}) {
  const { theme } = useTheme();
  const [aiOptions, setAIOptions] = useState([]);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => {
    if (visible) {
      setShowAIOptions(false);
      setCopied(false);
      getSelectedAIOptions()
        .then(setAIOptions)
        .catch((error) => {
          console.error("Failed to load AI services", error);
          setAIOptions([]);
        });
    }

    return () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    };
  }, [visible]);

  if (!prompt) return null;

  const copyPrompt = async () => {
    await Clipboard.setStringAsync(prompt.body);
    onMarkUsed(prompt.id);
    setCopied(true);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
    }
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const handleUseWithAI = async () => {
    if (aiOptions.length === 0) {
      await Clipboard.setStringAsync(prompt.body);
      onMarkUsed(prompt.id);
      Alert.alert(i18n.t("aiServices"), i18n.t("noAIServiceSelected"));
      return;
    }
    setShowAIOptions((current) => !current);
  };

  const openAIService = async (option) => {
    try {
      await Clipboard.setStringAsync(prompt.body);
      const canOpen = await Linking.canOpenURL(option.baseUrl);
      if (!canOpen) throw new Error(`Cannot open ${option.baseUrl}`);
      await Linking.openURL(option.baseUrl);
      onMarkUsed(prompt.id);
      onClose();
    } catch (error) {
      console.error("Failed to open AI service", error);
      Alert.alert(i18n.t("aiServices"), i18n.t("openLinkError"));
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      i18n.t("deletePromptTitle"),
      i18n.t("deletePromptMessage"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => {
            onDelete(prompt.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable
            style={styles.headerButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("close")}
          >
            <Feather name="x" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {i18n.t("prompt")}
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerButton}
              onPress={() => onToggleFavorite(prompt.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: prompt.favorite }}
              accessibilityLabel={i18n.t(
                prompt.favorite ? "removeFavorite" : "addFavorite"
              )}
            >
              <Feather
                name="star"
                size={20}
                color={prompt.favorite ? "#E5A50A" : theme.text}
                fill={prompt.favorite ? "#E5A50A" : "transparent"}
              />
            </Pressable>
            <Pressable
              style={styles.headerButton}
              onPress={() => onEdit(prompt)}
              accessibilityRole="button"
              accessibilityLabel={i18n.t("editPrompt")}
            >
              <Feather name="edit-2" size={19} color={theme.text} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Text selectable style={[styles.title, { color: theme.text }]}>
            {prompt.title}
          </Text>
          {prompt.tags.length > 0 && (
            <View style={styles.tags}>
              {prompt.tags.map((tag) => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: theme.textInputBG }]}
                >
                  <Text
                    style={[styles.tagText, { color: theme.textSecondary }]}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View
            style={[
              styles.bodyCard,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Text selectable style={[styles.body, { color: theme.text }]}>
              {prompt.body}
            </Text>
          </View>

          {showAIOptions && (
            <View style={styles.aiSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {i18n.t("chooseAIService")}
              </Text>
              <View style={styles.aiGrid}>
                {aiOptions.map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.aiButton,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => openAIService(option)}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                  >
                    <Text style={[styles.aiText, { color: theme.text }]}>
                      {option.label}
                    </Text>
                    <Feather
                      name="external-link"
                      size={16}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <Pressable
            style={styles.deleteButton}
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("delete")}
          >
            <Feather name="trash-2" size={17} color="#D94949" />
            <Text style={styles.deleteText}>{i18n.t("deletePrompt")}</Text>
          </Pressable>
        </ScrollView>

        <View
          style={[
            styles.bottomActions,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
            },
          ]}
        >
          <Pressable
            style={[
              styles.secondaryButton,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={copyPrompt}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("copyPrompt")}
          >
            <Feather
              name={copied ? "check" : "copy"}
              size={18}
              color={copied ? theme.primary : theme.text}
            />
            <Text style={[styles.buttonText, { color: theme.text }]}>
              {i18n.t(copied ? "copied" : "copy")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleUseWithAI}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("useWithAI")}
          >
            <Feather name="zap" size={18} color={theme.primaryText} />
            <Text style={[styles.buttonText, { color: theme.primaryText }]}>
              {i18n.t("useWithAI")}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NotoSansKR",
  },
  headerActions: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 23,
    lineHeight: 31,
    fontFamily: "NotoSansKR",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
  bodyCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 17,
    marginTop: 18,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "NotoSansKR-Regular",
  },
  aiSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 10,
    fontFamily: "NotoSansKR",
  },
  aiGrid: {
    gap: 8,
  },
  aiButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 14,
  },
  aiText: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  deleteButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 28,
  },
  deleteText: {
    color: "#D94949",
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  bottomActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 9,
  },
  primaryButton: {
    flex: 1.4,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 9,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
});
