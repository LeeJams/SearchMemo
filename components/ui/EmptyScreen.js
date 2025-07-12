import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

function EmptyScreen() {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
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
    fontSize: 16,
    fontFamily: "NotoSansKR",
  },
});
