import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

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
      label: "Naver",
      icon: "neos",
      key: "option8",
      color: "#03c75a",
      onPress: () => {
        Linking.openURL(
          "https://search.naver.com/search.naver?query=" + selectedMemo.text
        );
        props.closeModal();
      },
    },
    {
      label: "Pinterest",
      icon: "pinterest",
      key: "option3",
      color: "#FF0000",
      onPress: () => {
        Linking.openURL(
          "https://www.pinterest.co.kr/search/pins/?q=" + selectedMemo.text
        );
        props.closeModal();
      },
    },
    {
      label: "Reddit",
      icon: "reddit",
      key: "option7",
      color: "#ff4500",
      onPress: () => {
        Linking.openURL(
          "https://www.reddit.com/search/?q=" + selectedMemo.text
        );
        props.closeModal();
      },
    },
    {
      label: "Copy",
      icon: "copy",
      key: "option4",
      color: "#000",
      onPress: async () => {
        await Clipboard.setStringAsync(selectedMemo.text);
        props.closeModal();
      },
    },
    {
      label: "Edit",
      icon: "edit",
      key: "option5",
      color: "#000",
      onPress: () => props.modifyMemo(selectedMemo),
    },
    {
      label: "Delete",
      icon: "eraser",
      key: "option6",
      color: "#000",
      onPress: () => props.deleteMemo(selectedMemo.id),
    },
  ];

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
          {options.map((option, idx) => (
            <View key={option.key} style={styles.optionWrapper}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={option.onPress}
              >
                <FontAwesome5
                  name={option.icon}
                  size={23}
                  color={option.color}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
              {/* {idx !== 5 && <View style={styles.separator}></View>} */}
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

export default SelectModal;
