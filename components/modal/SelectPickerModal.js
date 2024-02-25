import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { AntDesign } from "@expo/vector-icons";

const SelectModal = (props) => {
  const selectedMemo = props.selectedMemo;
  const options = [
    {
      label: "Google",
      icon: "google",
      key: "option1",
      color: "#0357c4",
      onPress: () => {
        Linking.openURL("https://www.google.com/search?q=" + selectedMemo.text);
        props.closeModal();
      },
    },
    {
      label: "Youtube",
      icon: "youtube",
      key: "option2",
      color: "#FF0000",
      onPress: () => {
        Linking.openURL(
          "https://www.youtube.com/results?search_query=" + selectedMemo.text
        );
        props.closeModal();
      },
    },
    {
      label: "복사",
      icon: "copy1",
      key: "option3",
      color: "#000",
      onPress: async () => {
        await Clipboard.setStringAsync(selectedMemo.text);
        props.closeModal();
      },
    },
    {
      label: "수정",
      icon: "edit",
      key: "option4",
      color: "#000",
      onPress: () => props.modifyMemo(selectedMemo),
    },
    {
      label: "삭제",
      icon: "delete",
      key: "option5",
      color: "#000",
      onPress: () => props.deleteMemo(selectedMemo.id),
    },
    {
      label: "취소",
      icon: "close",
      key: "option6",
      color: "#000",
      onPress: () => props.closeModal(),
    },
  ];

  return (
    <Modal visible={props.visible} animationType="none" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.optionsContainer}>
          {options.map((option, idx) => (
            <View key={option.key} style={{ alignContent: "center" }}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={option.onPress}
              >
                <AntDesign
                  name={option.icon}
                  size={23}
                  color={option.color}
                  style={{ width: "35%", textAlign: "right" }}
                />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
              {idx !== 5 && <View style={styles.separator}></View>}
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
    margin: "15%",
    borderRadius: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  optionText: {
    width: "65%",
    fontSize: 17,
    marginLeft: 30,
    fontFamily: "NotoSansKR",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});

export default SelectModal;
