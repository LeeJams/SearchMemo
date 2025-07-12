import React, { useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import SettingsScreen from "../settings/SettingsScreen";
import { useTheme } from "../../hooks/useTheme";

const RightSheet = ({ visible, onClose }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const sheetWidth = width * 0.7;
  const translateX = useSharedValue(width);

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(width - sheetWidth, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateX.value = withTiming(width, {
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
    <Modal visible={visible} transparent={true} animationType="none">
      <View style={styles.container}>
        <Pressable
          style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}
          onPress={onClose}
        />
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
            <SettingsScreen />
          </View>
        </Animated.View>
      </View>
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
    left: 0,
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
