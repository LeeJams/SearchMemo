import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

const SelectModal = (props) => {
  const options = [
    {
      label: "수정",
      value: "option1",
      onPress: () => props.modifyMemo(props.id),
    },
    {
      label: "삭제",
      value: "option2",
      onPress: () => props.deleteMemo(props.id),
    },
    {
      label: "취소",
      value: "option3",
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
