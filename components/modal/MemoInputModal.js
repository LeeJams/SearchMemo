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

const { DEFAULT_MEMO_COLOR } = require("../../utill/memoModel");

const MemoInputModal = forwardRef((props, ref) => {
  const { theme } = useTheme();
  const [isModify, setIsModify] = useState(false);
  const [warning, setWarning] = useState(false);
  const [memoData, setMemoData] = useState({
    id: null,
    text: "",
    color: DEFAULT_MEMO_COLOR,
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
    setMemoData({ id: null, text: "", color: DEFAULT_MEMO_COLOR, date: "" });
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
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
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
            maxLength={500}
            accessibilityLabel={i18n.t("memoPlaceholder")}
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
                    borderColor:
                      memoData.color === color ? theme.primary : theme.border,
                    borderWidth: memoData.color === color ? 2 : 1,
                  },
                ]}
                onPress={() => colorSelectHandler(color)}
                accessibilityRole="button"
                accessibilityState={{ selected: memoData.color === color }}
                accessibilityLabel={`Color ${idx + 1}`}
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
    padding: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1,
  },
  textInput: {
    borderRadius: 6,
    width: "100%",
    padding: 16,
    minHeight: 118,
    textAlignVertical: "top",
    marginBottom: 8,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 16,
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
    marginVertical: 12,
    gap: 10,
  },
  colorButton: {
    width: 34,
    height: 34,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    borderRadius: 6,
  },
  addButtonText: {
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    borderRadius: 6,
  },
  cancelButtonText: {},
});
