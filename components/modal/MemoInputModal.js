import { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  Text,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import CommonButton from "../ui/CommonButton";
import { colorOptions } from "../../utill/option";

export default MemoInputModal = forwardRef((props, ref) => {
  const [isModify, setIsModify] = useState(false);
  const [warning, setWarning] = useState(false);
  const [memoData, setMemoData] = useState({
    id: null,
    text: "",
    color: "#e6e6e6",
    date: "",
  });

  useImperativeHandle(ref, () => ({
    modifyMemoHandler,
  }));

  function modifyMemoHandler(originMemo) {
    setMemoData(originMemo);
    setIsModify(true);
  }

  function memoInputHandler(enteredText) {
    if (enteredText.length > 0) {
      setWarning(false);
    }
    setMemoData((prevMemoData) => ({ ...prevMemoData, text: enteredText }));
  }

  function colorSelectHandler(color) {
    setMemoData((prevMemoData) => ({ ...prevMemoData, color: color }));
  }

  function addMemoHandler() {
    if (!memoData.text.trim()) {
      setWarning(true);
      return;
    }
    if (isModify) props.modifyMemo(memoData);
    else props.addMemo(memoData);
    modalCloseHandler();
  }

  function modalCloseHandler() {
    setMemoData({ id: null, text: "", color: "#e6e6e6", date: "" });
    setIsModify(false);
    setWarning(false);
    props.closeModal();
  }

  const options = colorOptions;

  return (
    <Modal
      visible={props.modalIsVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={modalCloseHandler}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
        <Pressable
          onPress={modalCloseHandler}
          style={styles.modalPressOverlay}
        ></Pressable>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="메모를 입력해주세요."
            onChangeText={memoInputHandler}
            value={memoData.text}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
          />
          {warning && (
            <Text style={styles.warningText}>내용을 입력해주세요.</Text>
          )}
          <View style={styles.colorContainer}>
            {options.map((color, idx) => (
              <Pressable
                key={idx}
                style={{
                  ...styles.colorButton,
                  backgroundColor: color,
                  borderWidth: memoData.color === color ? 2 : 0,
                }}
                onPress={() => colorSelectHandler(color)}
              ></Pressable>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <CommonButton onPress={modalCloseHandler} name="cancel">
              Cancel
            </CommonButton>
            <CommonButton onPress={addMemoHandler} name="add">
              {isModify ? "Edit" : "Add"}
            </CommonButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalPressOverlay: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    width: "100%",
    padding: 16,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowOpacity: 0.25,
    elevation: 10,
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
    paddingLeft: 12,
    fontFamily: "NotoSansKR",
  },
  colorContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#000",
    marginHorizontal: 10,
    backgroundColor: "#ececec",
  },
});
