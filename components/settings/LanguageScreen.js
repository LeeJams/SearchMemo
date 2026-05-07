import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../hooks/useLanguage";
import i18n from "../../locales/i18n";
import { Feather } from "@expo/vector-icons";

const LanguageScreen = ({ onClose }) => {
  const { theme } = useTheme();
  const { locale, languages, changeLanguage } = useLanguage();
  const currentLanguage = locale.substring(0, 2);

  const handleSelectLanguage = async (code) => {
    try {
      await changeLanguage(code);
      Alert.alert(i18n.t("language"), i18n.t("languageChanged"));
    } catch (error) {
      console.error("Failed to save language:", error);
      Alert.alert("Error", "Failed to apply language change.");
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.itemContainer, { borderBottomColor: theme.border }]}
      onPress={() => handleSelectLanguage(item.code)}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <Text style={[styles.itemText, { color: theme.text }]}>{item.name}</Text>
      {currentLanguage === item.code && (
        <Feather name="check" size={20} color={theme.primary} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          onPress={onClose}
          style={styles.backButton}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("cancel")}
        >
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
    </SafeAreaView>
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
