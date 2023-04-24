import { useState } from "react";
import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";

import MemoItem from "../memo/MemoItem";

export default function Main(props) {
  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.goalsContainer}>
        <FlatList
          data={props.courseGoals}
          renderItem={(itemData) => {
            return (
              <MemoItem
                text={itemData.item.text}
                id={itemData.item.id}
                date={itemData.item.date}
                onDeleteItem={props.doneMemoHandler}
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
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  goalsContainer: {
    flex: 5,
    paddingHorizontal: 15,
  },
});
