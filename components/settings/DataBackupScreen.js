import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { exportBackup, pickAndParseBackup } from "../../utill/backupService";
import i18n from "../../locales/i18n";

const { mergeBackupData } = require("../../utill/backupModel");

export default function DataBackupScreen({
  memos,
  prompts,
  onImportData,
  onClose,
}) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [isWorking, setIsWorking] = useState(false);

  const runExport = async () => {
    setIsWorking(true);
    try {
      await exportBackup({ memos, prompts });
    } catch (error) {
      console.error("Failed to export backup", error);
      Alert.alert(i18n.t("dataBackup"), i18n.t("backupExportError"));
    } finally {
      setIsWorking(false);
    }
  };

  const confirmExport = () => {
    Alert.alert(
      i18n.t("backupPrivacyWarningTitle"),
      i18n.t("backupPrivacyWarningMessage"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("continue"),
          onPress: runExport,
        },
      ]
    );
  };

  const importBackup = async () => {
    setIsWorking(true);
    try {
      const importedData = await pickAndParseBackup();
      if (!importedData) return;

      const mergedData = mergeBackupData(
        { memos, prompts },
        importedData
      );
      Alert.alert(
        i18n.t("backupImportConfirmTitle"),
        i18n.t("backupImportConfirmMessage", {
          memoCount: importedData.memos.length,
          promptCount: importedData.prompts.length,
        }),
        [
          { text: i18n.t("cancel"), style: "cancel" },
          {
            text: i18n.t("confirm"),
            onPress: () => {
              onImportData(mergedData);
              Alert.alert(
                i18n.t("dataBackup"),
                i18n.t("backupImportSuccess")
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to import backup", error);
      Alert.alert(i18n.t("dataBackup"), i18n.t("backupImportError"));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={styles.headerButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("close")}
        >
          <Feather name="chevron-left" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {i18n.t("dataBackup")}
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather name="database" size={25} color={theme.primary} />
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {i18n.t("backupDescription")}
          </Text>
          <Text style={[styles.counts, { color: theme.text }]}>
            {i18n.t("backupCounts", {
              memoCount: memos.length,
              promptCount: prompts.length,
            })}
          </Text>
        </View>

        <View
          style={[
            styles.warningCard,
            {
              backgroundColor: theme.textInputBG,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather name="alert-triangle" size={18} color="#C97816" />
          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            {i18n.t("backupPrivacyNotice")}
          </Text>
        </View>

        <BackupButton
          icon="share"
          title={i18n.t("exportBackup")}
          description={i18n.t("exportBackupDescription")}
          onPress={confirmExport}
          disabled={isWorking}
        />
        <BackupButton
          icon="upload"
          title={i18n.t("importBackup")}
          description={i18n.t("importBackupDescription")}
          onPress={importBackup}
          disabled={isWorking}
        />

        {isWorking && (
          <View style={styles.working}>
            <ActivityIndicator color={theme.primary} />
            <Text style={[styles.workingText, { color: theme.textSecondary }]}>
              {i18n.t("backupWorking")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function BackupButton({ icon, title, description, onPress, disabled }) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        {
          backgroundColor: theme.backgroundSecondary,
          borderColor: theme.border,
        },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.textInputBG }]}>
        <Feather name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.actionText}>
        <Text style={[styles.actionTitle, { color: theme.text }]}>{title}</Text>
        <Text
          style={[styles.actionDescription, { color: theme.textSecondary }]}
        >
          {description}
        </Text>
      </View>
      <Feather name="chevron-right" size={19} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "NotoSansKR",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    alignItems: "center",
    padding: 18,
    borderWidth: 1,
    borderRadius: 10,
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    fontFamily: "NotoSansKR-Regular",
  },
  counts: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: "NotoSansKR",
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 13,
    borderWidth: 1,
    borderRadius: 9,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "NotoSansKR-Regular",
  },
  actionCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderWidth: 1,
    borderRadius: 10,
  },
  actionIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
  },
  actionDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "NotoSansKR-Regular",
  },
  working: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
  },
  workingText: {
    fontSize: 12,
    fontFamily: "NotoSansKR-Regular",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
