import { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  Text,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CommonButton from "../ui/CommonButton";
import { colorOptions } from "../../utill/option";
import i18n from "../../locales/i18n";
import { useTheme } from "../../hooks/useTheme";

const MemoInputModal = forwardRef((props, ref) => {
  const { theme } = useTheme();
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
    if (isModify) {
      props.modifyMemo(memoData);
    } else {
      props.addMemo(memoData);
    }
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
      visible={props.visible}
      animationType="slide"
      transparent={true}
      onRequestClose={modalCloseHandler}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <Pressable
          onPress={modalCloseHandler}
          style={styles.modalPressOverlay}
        ></Pressable>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.textInputBG,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder={i18n.t("memoPlaceholder")}
            placeholderTextColor={theme.textSecondary}
            onChangeText={memoInputHandler}
            value={memoData.text}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            multiline={true}
          />
          {warning && (
            <Text style={styles.warningText}>{i18n.t("warning")}</Text>
          )}
          <View style={styles.colorContainer}>
            {options.map((color, idx) => (
              <Pressable
                key={idx}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: color,
                  },
                ]}
                onPress={() => colorSelectHandler(color)}
              >
                {memoData.color === color && (
                  <Feather name="check" size={18} color={theme.text} />
                )}
              </Pressable>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <CommonButton
              onPress={modalCloseHandler}
              style={[
                styles.cancelButton,
                {
                  backgroundColor: theme.cancelButtonBG,
                  borderWidth: 0,
                },
              ]}
              textStyle={[
                styles.cancelButtonText,
                { color: theme.cancelButtonText },
              ]}
            >
              {i18n.t("cancel")}
            </CommonButton>
            <CommonButton
              onPress={addMemoHandler}
              style={[
                styles.addButton,
                {
                  backgroundColor: theme.addButton,
                  borderWidth: 0,
                },
              ]}
              textStyle={[styles.addButtonText, { color: theme.addButtonText }]}
            >
              {isModify ? `${i18n.t("modify")}` : `${i18n.t("add")}`}
            </CommonButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

export default MemoInputModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalPressOverlay: {
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  textInput: {
    borderRadius: 10,
    width: "100%",
    padding: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 10,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
    justifyContent: "space-around",
  },
  colorButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 10,
  },
  addButtonText: {
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
  },
  cancelButtonText: {},
});
