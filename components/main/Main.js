import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";

import MemoItem from "../memo/MemoItem";
export default function Main(props) {
  const leftMemos = props.memos.filter((memo, idx) => (idx + 1) % 2 === 1);
  const rightMemos = props.memos.filter((memo, idx) => (idx + 1) % 2 === 0);

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.memosContainer}>
        <FlatList
          data={leftMemos}
          style={styles.memoListContainer}
          renderItem={(itemData) => {
            return (
              <MemoItem
                item={itemData.item}
                openSelectPicker={props.openSelectPicker}
              />
            );
          }}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          alwaysBounceVertical={false}
        />
        <FlatList
          data={rightMemos}
          style={styles.memoListContainer}
          renderItem={(itemData) => {
            return (
              <MemoItem
                item={itemData.item}
                openSelectPicker={props.openSelectPicker}
              />
            );
          }}
          keyExtractor={(item, index) => {
            return item.id;
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
  memosContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  memoListContainer: {
    flex: 1,
  },
});
