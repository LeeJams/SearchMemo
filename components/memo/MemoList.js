import { StyleSheet, FlatList, View } from "react-native";
import MemoItem from "./MemoItem";
import { useCallback } from "react";

function MemoList({ memos, openMemo, locale }) {
  const renderMemoItem = useCallback(
    ({ item }) => <MemoItem item={item} openMemo={openMemo} />,
    [openMemo]
  );

  return (
    <FlatList
      data={memos}
      style={styles.memoListContainer}
      contentContainerStyle={styles.contentContainer}
      renderItem={renderMemoItem}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      extraData={locale}
      alwaysBounceVertical={false}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

export default MemoList;

const styles = StyleSheet.create({
  memoListContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 112,
  },
  separator: {
    height: 10,
  },
});
