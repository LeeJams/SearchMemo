import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";
import { Feather } from "@expo/vector-icons";

function EmptyScreen() {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Feather name="search" size={26} color={theme.textSecondary} />
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {i18n.t("memoEmpty")}
      </Text>
    </View>
  );
}

export default EmptyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "NotoSansKR",
  },
});
