import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
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
  // Keep a visible strip of the backdrop, even on narrow phones.
  const sheetWidth = Math.min(420, width - 48);
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      setMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!mounted) return;
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 260 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
    return () => animation.stop();
  }, [visible, mounted, progress]);

  const animatedStyle = {
    transform: [{ translateX: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [sheetWidth, 0],
    }) }],
  };

  return (
    <Modal
      visible={mounted}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <View style={styles.container}>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={i18n.t("close")}
            style={styles.overlay}
          >
            <Animated.View
              pointerEvents="none"
              style={[styles.overlay, { backgroundColor: theme.modalOverlay, opacity: progress }]}
            />
          </Pressable>
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
