import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

const SelectModal = ({ visible }) => {
  const options = [
    {
      label: "Option 1",
      value: "option1",
      onPress: () => console.log("option 1 pressed"),
    },
    {
      label: "Option 2",
      value: "option2",
      onPress: () => console.log("option 2 pressed"),
    },
    {
      label: "Option 3",
      value: "option3",
      onPress: () => console.log("option 3 pressed"),
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
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
