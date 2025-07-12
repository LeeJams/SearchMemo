import { StyleSheet, FlatList } from "react-native";
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
      numColumns={2}
      columnWrapperStyle={styles.wrapper}
      style={styles.memoListContainer}
      renderItem={renderMemoItem}
      keyExtractor={(item) => item.id.toString()}
      alwaysBounceVertical={false}
    />
  );
}

export default MemoList;

const styles = StyleSheet.create({
  memoListContainer: {
    flex: 1,
  },
  wrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
});
