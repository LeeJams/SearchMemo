import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";

const SelectModal = (props) => {
  const selectedMemo = props.selectedMemo;
  console.log(selectedMemo);
  const options = [
    {
      label: "구글로 검색",
      value: "option1",
      onPress: () => {
        Linking.openURL("https://www.google.com/search?q=" + selectedMemo.text);
        props.closeModal();
      },
    },
    {
      label: "유튜브로 검색",
      value: "option2",
      onPress: () => {
        Linking.openURL(
          "https://www.youtube.com/results?search_query=" + selectedMemo.text
        );
        props.closeModal();
      },
    },
    {
      label: "복사",
      value: "option3",
      onPress: async () => {
        await Clipboard.setStringAsync(selectedMemo.text);
        props.closeModal();
      },
    },
    {
      label: "수정",
      value: "option4",
      onPress: () => props.modifyMemo(selectedMemo),
    },
    {
      label: "삭제",
      value: "option5",
      onPress: () => props.deleteMemo(selectedMemo.id),
    },
    {
      label: "취소",
      value: "option6",
      onPress: () => props.closeModal(),
    },
  ];

  return (
    <Modal visible={props.visible} animationType="none" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={option.onPress}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
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
    margin: 60,
    borderRadius: 8,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  optionButton: {
    padding: 15,
  },
  optionText: {
    textAlign: "center",
    fontSize: 17,
  },
});

export default SelectModal;
