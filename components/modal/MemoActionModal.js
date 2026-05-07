import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Linking,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { getActionOptions, getFixedActionOptions } from "../../utill/option";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { searchIconMap } from "../icons/SearchIcons";
import i18n from "../../locales/i18n";

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
      const fixedOptions = getFixedActionOptions();
      const searchOpts = options.filter(
        (opt) => !fixedOptions.some((fixed) => fixed.key === opt.key)
      );
      setSearchOptions(searchOpts);
    } catch (error) {
      console.error("Failed to load action options:", error);
    } finally {
      setLoading(false);
    }
  };

  const openExternalUrl = async (url) => {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error(`Cannot open URL: ${url}`);
    }
    await Linking.openURL(url);
  };

  const confirmDelete = () => {
    Alert.alert(i18n.t("deleteConfirmTitle"), i18n.t("deleteConfirmMessage"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => {
          deleteMemo(selectedMemo.id);
          closeModal();
        },
      },
    ]);
  };

  const handleOptionPress = async (option) => {
    if (!selectedMemo) return;

    try {
      switch (option.key) {
        case "copy":
          await Clipboard.setStringAsync(selectedMemo.text);
          Alert.alert(i18n.t("copy"), i18n.t("copiedToClipboard"));
          closeModal();
          break;
        case "edit":
          modifyMemo(selectedMemo);
          closeModal();
          break;
        case "delete":
          confirmDelete();
          break;
        default:
          if (option.baseUrl) {
            if (option.copyToClipboard) {
              await Clipboard.setStringAsync(selectedMemo.text);
              Alert.alert(i18n.t("copy"), i18n.t("copiedToClipboard"));
              await openExternalUrl(option.baseUrl);
            } else {
              await openExternalUrl(
                option.baseUrl + encodeURIComponent(selectedMemo.text)
              );
            }
          }
          closeModal();
      }
    } catch (error) {
      console.error("Failed to handle memo action:", error);
      Alert.alert(i18n.t("search"), i18n.t("openLinkError"));
    }
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
        accessibilityRole="button"
        accessibilityLabel={option.label}
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
      animationType="slide"
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
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
          </View>
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
                {getFixedActionOptions().map((option) =>
                  renderOption(option, true)
                )}
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
    justifyContent: "flex-end",
  },
  optionsContainer: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1,
    maxHeight: "72%",
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 10,
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
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  fixedOptionWrapper: {
    alignItems: "center",
    flex: 1,
  },
  optionButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
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
