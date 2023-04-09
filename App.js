import { useState } from 'react';
import { StyleSheet, View, FlatList, Button, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import MemoItem from './components/MemoItem';
import MemoInput from './components/MemoInput';

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [courseGoals, setCourseGoals] = useState([]);

  function openInputModal() {
    setModalIsVisible(true);
  }

  function closeModalHandler() {
    setModalIsVisible(false);
  }

  function addMemoHandler(enteredGoalText) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
    closeModalHandler();
  }

  function doneMemoHandler(id) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.id !== id);
    });
  }

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.goalsContainer}>
          <FlatList
            data={courseGoals}
            renderItem={(itemData) => {
              return (
                <MemoItem
                  text={itemData.item.text}
                  id={itemData.item.id}
                  onDeleteItem={doneMemoHandler}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            alwaysBounceVertical={false}
          />
        </View>
        <MemoInput
          visible={modalIsVisible}
          onAddGoal={addMemoHandler}
          onCancel={closeModalHandler}
        />
        <Button title="Add Memo" color="#000" onPress={openInputModal} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  goalsContainer: {
    flex: 5,
    paddingHorizontal: 15,
  },
});
