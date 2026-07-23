import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

const { parseBackup, serializeBackup } = require("./backupModel");

export async function exportBackup(data) {
  const sharingAvailable = await Sharing.isAvailableAsync();
  if (!sharingAvailable) {
    throw new Error("sharing-unavailable");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = new File(Paths.cache, `memofind-backup-${timestamp}.json`);
  file.create({ overwrite: true, intermediates: true });
  file.write(serializeBackup(data));

  await Sharing.shareAsync(file.uri, {
    dialogTitle: "MemoFind backup",
    mimeType: "application/json",
    UTI: "public.json",
  });
}

export async function pickAndParseBackup() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) {
    return null;
  }

  const file = new File(result.assets[0].uri);
  return parseBackup(await file.text());
}
