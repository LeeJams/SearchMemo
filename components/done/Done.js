import { StyleSheet, View, FlatList, SafeAreaView, Text } from "react-native";
export default function Done(props) {
  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.savedMemosContainer}>
        <FlatList
          data={props.savedMemos}
          renderItem={(itemData) => {
            return <Text>{itemData.item}</Text>;
          }}
          keyExtractor={(item, index) => {
            return index;
          }}
          alwaysBounceVertical={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  savedMemosContainer: {
    paddingHorizontal: 15,
  },
});
