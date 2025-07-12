import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Linking,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { getActionOptions, fixedActionOptions } from "../../utill/option";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { searchIconMap } from "../icons/SearchIcons";

const NUM_COLUMNS = 3;

function MemoActionModal({
  visible,
  closeModal,
  selectedMemo,
  modifyMemo,
  deleteMemo,
}) {
  const { theme } = useTheme();
  const [searchOptions, setSearchOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadActionOptions();
    }
  }, [visible]);

  const loadActionOptions = async () => {
    try {
      setLoading(true);
      const options = await getActionOptions();
      // fixedActionOptions를 제외한 검색 옵션만 필터링
      const searchOpts = options.filter(
        (opt) => !fixedActionOptions.some((fixed) => fixed.key === opt.key)
      );
      setSearchOptions(searchOpts);
    } catch (error) {
      console.error("Failed to load action options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionPress = (option) => {
    if (!selectedMemo) return;

    switch (option.key) {
      case "copy":
        Clipboard.setStringAsync(selectedMemo.text);
        break;
      case "edit":
        modifyMemo(selectedMemo);
        break;
      case "delete":
        deleteMemo(selectedMemo.id);
        break;
      default:
        if (option.baseUrl) {
          // AI 서비스 등 클립보드 복사가 필요한 경우
          if (option.copyToClipboard) {
            Clipboard.setStringAsync(selectedMemo.text);
            Linking.openURL(option.baseUrl);
          } else {
            // 일반 검색 서비스
            Linking.openURL(
              option.baseUrl + encodeURIComponent(selectedMemo.text)
            );
          }
        }
    }
    closeModal();
  };

  const renderIcon = (option) => {
    const IconComponent = searchIconMap[option.key];
    if (!IconComponent) return null;

    // 복사, 수정, 삭제 아이콘은 테마 색상 사용
    const isActionIcon = ["copy", "edit", "delete"].includes(option.key);
    const iconColor = isActionIcon ? theme.text : option.color;
    const iconSize = isActionIcon ? 20 : 23;

    return <IconComponent size={iconSize} color={iconColor} />;
  };

  const renderOption = (option, isFixed = false) => (
    <View
      key={option.key}
      style={[
        isFixed ? styles.fixedOptionWrapper : styles.optionWrapper,
        {
          opacity: selectedMemo ? 1 : 0.5,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.optionButton,
          isFixed && styles.fixedOptionButton,
          pressed && { backgroundColor: theme.textInputBG },
        ]}
        onPress={() => handleOptionPress(option)}
        android_ripple={{ color: theme.border }}
        disabled={!selectedMemo}
      >
        {renderIcon(option)}
        <Text
          style={[
            styles.optionText,
            isFixed && styles.fixedOptionText,
            { color: theme.text },
          ]}
        >
          {option.label}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={closeModal}
      transparent={true}
    >
      <Pressable
        style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        onPress={closeModal}
      >
        <Pressable
          style={[
            styles.optionsContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {searchOptions.map((option) => renderOption(option, false))}
              </ScrollView>
              <View
                style={[
                  styles.fixedActionsContainer,
                  { borderTopColor: theme.border },
                ]}
              >
                {fixedActionOptions.map((option) => renderOption(option, true))}
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default React.memo(MemoActionModal);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  optionsContainer: {
    marginHorizontal: "5%",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: "70%", // 최대 높이 제한
    overflow: "hidden",
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  optionWrapper: {
    width: `${100 / NUM_COLUMNS}%`,
    marginVertical: 6,
    alignItems: "center",
  },
  fixedActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  fixedOptionWrapper: {
    alignItems: "center",
    flex: 1,
  },
  optionButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  fixedOptionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  optionText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  fixedOptionText: {
    fontSize: 12,
    marginTop: 2,
  },
  pressed: {
    // backgroundColor는 이제 동적으로 적용됨
  },
  loadingContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
