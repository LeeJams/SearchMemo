import React, { useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SettingsScreen from "../settings/SettingsScreen";
import { useTheme } from "../../hooks/useTheme";
import i18n from "../../locales/i18n";

const RightSheet = ({
  visible,
  onClose,
  memos,
  folders,
  onImportData,
}) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const sheetWidth = Math.min(width, Math.max(320, width * 0.82));
  const translateX = useSharedValue(sheetWidth);

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateX.value = withTiming(sheetWidth, {
        duration: 300,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [visible, width, sheetWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("close")}
          >
            <View
              style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.sheetWrapper,
              {
                width: sheetWidth,
              },
              animatedStyle,
            ]}
          >
            <View
              style={[
                styles.sheetContainer,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <SettingsScreen
                memos={memos}
                folders={folders}
                onImportData={onImportData}
                onClose={onClose}
              />
            </View>
          </Animated.View>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
  },
  sheetContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default RightSheet;
