import { StyleSheet, FlatList, View } from "react-native";
import MemoItem from "./MemoItem";
import { useCallback } from "react";

function MemoList({ memos, openModal }) {
  const renderMemoItem = useCallback(
    ({ item }) => <MemoItem item={item} openActionModal={openModal} />,
    [openModal]
  );

  return (
    <FlatList
      data={memos}
      style={styles.memoListContainer}
      contentContainerStyle={styles.contentContainer}
      renderItem={renderMemoItem}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingVertical: 14,
    paddingBottom: 88,
  },
  separator: {
    height: 8,
  },
});
