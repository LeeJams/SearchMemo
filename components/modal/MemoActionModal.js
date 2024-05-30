import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome5 } from "@expo/vector-icons";
import { actionOptions } from "../../utill/option";

const MemoActionModal = (props) => {
  const selectedMemo = props.selectedMemo;
  const options = actionOptions;

  const handleOptionPress = (option) => {
    if (option.key === "copy") {
      Clipboard.setStringAsync(selectedMemo.text);
    } else if (option.key === "edit") {
      props.modifyMemo(selectedMemo);
    } else if (option.key === "delete") {
      props.deleteMemo(selectedMemo.id);
    } else if (option.baseUrl) {
      Linking.openURL(option.baseUrl + selectedMemo.text);
    }
    props.closeModal();
  };

  return (
    <Modal
      visible={props.visible}
      animationType="none"
      onRequestClose={props.closeModal}
      transparent={true}
    >
      <View style={styles.modalOverlay} onTouchEnd={props.closeModal}>
        <View
          style={styles.optionsContainer}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <View key={option.key} style={styles.optionWrapper}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionPress(option)}
              >
                <FontAwesome5
                  name={option.icon}
                  size={23}
                  color={option.color}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  optionsContainer: {
    margin: "5%",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionWrapper: {
    width: "33%",
    marginVertical: 6,
    alignContent: "center",
  },
  optionButton: {
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
    margin: 2,
  },
  optionText: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});

export default MemoActionModal;
