import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Text,
  KeyboardAvoidingView,
} from "react-native";

function GoalInput(props) {
  const [enteredGoalText, setEnteredGoalText] = useState("");
  const [warning, setWarning] = useState(false);
  const navigation = useNavigation();

  function goalInputHandler(enteredText) {
    if (enteredText.length > 0) {
      setWarning(false);
    }
    setEnteredGoalText(enteredText);
  }

  function addGoalHandler() {
    if (enteredGoalText.length === 0) {
      setWarning(true);
      return;
    }
    props.onAddGoal(enteredGoalText);
    setEnteredGoalText("");
    navigation.navigate("Main");
  }
  function modalCloseHandler() {
    setEnteredGoalText("");
    setWarning(false);
    props.onCancel();
  }

  return (
    <Modal visible={props.visible} animationType="fade" transparent={true}>
      <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
        <View style={styles.modalOverlay}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="검색어를 입력해주세요."
              onChangeText={goalInputHandler}
              value={enteredGoalText}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
            {warning && (
              <Text style={styles.warningText}>내용을 입력해주세요.</Text>
            )}
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="취소" onPress={modalCloseHandler} />
              </View>
              <View style={styles.button}>
                <Button title="추가" onPress={addGoalHandler} />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default GoalInput;

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    shadowOpacity: 0.25,
    paddingBottom: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#ececec",
    color: "#120438",
    borderRadius: 6,
    width: "100%",
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    width: 100,
    marginHorizontal: 10,
  },
  warningText: {
    alignSelf: "flex-start",
    color: "#ea4747",
    fontSize: 12,
    paddingTop: 5,
    paddingLeft: 5,
  },
});
