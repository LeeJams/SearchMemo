import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

const LANGUAGE_KEY = "user-language";

const LanguageScreen = ({ onClose }) => {
  const { theme } = useTheme();

  const languages = [
    { code: "en", name: "English" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Русский" },
    { code: "hi", name: "हिन्दी" },
  ];

  const currentLanguage = i18n.locale.substring(0, 2);

  const handleSelectLanguage = async (code) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, code);
      i18n.locale = code;

      Alert.alert(
        "Language Changed",
        "The application needs to be restarted to apply the language change.",
        [{ text: "Restart", onPress: () => Updates.reloadAsync() }]
      );
    } catch (error) {
      console.error("Failed to save language:", error);
      Alert.alert("Error", "Failed to apply language change.");
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.itemContainer, { borderBottomColor: theme.border }]}
      onPress={() => handleSelectLanguage(item.code)}
    >
      <Text style={[styles.itemText, { color: theme.text }]}>{item.name}</Text>
      {currentLanguage === item.code && (
        <Feather name="check" size={20} color={theme.primary} />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {i18n.t("language")}
        </Text>
      </View>
      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default LanguageScreen;
