import { StyleSheet, FlatList } from "react-native";
import MemoItem from "./MemoItem";

export default MemoList = ({ memos, openModal }) => {
  return (
    <FlatList
      data={memos}
      numColumns={2}
      columnWrapperStyle={styles.wrapper}
      style={styles.memoListContainer}
      renderItem={(itemData) => {
        return <MemoItem item={itemData.item} openActionModal={openModal} />;
      }}
      keyExtractor={(item) => {
        return item.id;
      }}
      alwaysBounceVertical={false}
    />
  );
};

const styles = StyleSheet.create({
  memoListContainer: {
    flex: 1,
  },
  wrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
});
