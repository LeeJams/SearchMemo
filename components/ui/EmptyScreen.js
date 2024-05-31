import { StyleSheet, Text, View } from "react-native";
import i18n from "../../locales/i18n";

export default EmptyScreen = () => {
  return (
    <View style={styles.emptyScreenContainer}>
      <Text style={styles.emptyScreenText}>{i18n.t("memoEmpty")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyScreenText: {
    fontSize: 20,
    color: "#000000bf",
    fontFamily: "NotoSansKR",
  },
});
