const { migrateMemoCollection } = require("./memoModel");
const { migratePromptCollection } = require("./promptModel");
const { migrateFolderCollection } = require("./folderModel");

const BACKUP_FORMAT = "memofind-backup";
const BACKUP_VERSION = 2;
const SUPPORTED_BACKUP_VERSIONS = [1, BACKUP_VERSION];

function createBackupPayload(
  { memos, prompts, folders },
  now = () => new Date()
) {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now().toISOString(),
    memos: Array.isArray(memos) ? memos : [],
    prompts: Array.isArray(prompts) ? prompts : [],
    folders: Array.isArray(folders) ? folders : [],
  };
}

function serializeBackup(data, now) {
  return JSON.stringify(createBackupPayload(data, now), null, 2);
}

function isValidTimestamp(value) {
  return (
    typeof value === "string" && !Number.isNaN(new Date(value).getTime())
  );
}

function hasValidCommonFields(item) {
  return (
    Number.isInteger(item.schemaVersion) &&
    isValidTimestamp(item.createdAt) &&
    isValidTimestamp(item.updatedAt) &&
    typeof item.favorite === "boolean" &&
    Array.isArray(item.tags) &&
    item.tags.every((tag) => typeof tag === "string")
  );
}

function isValidMemo(item) {
  return (
    item &&
    typeof item === "object" &&
    hasValidCommonFields(item) &&
    String(item.id || "").trim() &&
    typeof item.text === "string" &&
    item.text.trim() &&
    typeof item.color === "string"
  );
}

function isValidPrompt(item) {
  return (
    item &&
    typeof item === "object" &&
    hasValidCommonFields(item) &&
    String(item.id || "").trim() &&
    typeof item.title === "string" &&
    typeof item.body === "string" &&
    item.body.trim() &&
    (item.lastUsedAt === null || isValidTimestamp(item.lastUsedAt))
  );
}

function isValidFolder(item) {
  return (
    item &&
    typeof item === "object" &&
    Number.isInteger(item.schemaVersion) &&
    String(item.id || "").trim() &&
    typeof item.name === "string" &&
    item.name.trim() &&
    isValidTimestamp(item.createdAt) &&
    isValidTimestamp(item.updatedAt)
  );
}

function parseBackup(backupValue, options) {
  let parsed;
  try {
    parsed =
      typeof backupValue === "string" ? JSON.parse(backupValue) : backupValue;
  } catch (error) {
    throw new Error("invalid-json");
  }

  if (
    !parsed ||
    parsed.format !== BACKUP_FORMAT ||
    !SUPPORTED_BACKUP_VERSIONS.includes(parsed.version) ||
    !isValidTimestamp(parsed.exportedAt) ||
    !Array.isArray(parsed.memos) ||
    !Array.isArray(parsed.prompts) ||
    (parsed.version >= 2 && !Array.isArray(parsed.folders))
  ) {
    throw new Error("invalid-backup");
  }

  const rawFolders = parsed.version >= 2 ? parsed.folders : [];
  if (
    !parsed.memos.every(isValidMemo) ||
    !parsed.prompts.every(isValidPrompt) ||
    !rawFolders.every(isValidFolder)
  ) {
    throw new Error("invalid-items");
  }

  const memos = migrateMemoCollection(parsed.memos, options);
  const prompts = migratePromptCollection(parsed.prompts, options);
  const folders = migrateFolderCollection(rawFolders, options);
  if (
    memos.length !== parsed.memos.length ||
    prompts.length !== parsed.prompts.length ||
    folders.length !== rawFolders.length
  ) {
    throw new Error("invalid-items");
  }

  return {
    format: BACKUP_FORMAT,
    version: parsed.version,
    exportedAt: parsed.exportedAt || null,
    memos,
    prompts,
    folders,
  };
}

function itemTimestamp(item) {
  const timestamp = new Date(item.updatedAt || item.createdAt || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function mergeByUpdatedAt(localItems, importedItems) {
  const merged = new Map(localItems.map((item) => [String(item.id), item]));

  for (const importedItem of importedItems) {
    const id = String(importedItem.id);
    const localItem = merged.get(id);
    if (!localItem || itemTimestamp(importedItem) > itemTimestamp(localItem)) {
      merged.set(id, importedItem);
    }
  }

  return [...merged.values()].sort(
    (a, b) => itemTimestamp(b) - itemTimestamp(a)
  );
}

function mergeBackupData(localData, importedData) {
  return {
    memos: mergeByUpdatedAt(localData.memos || [], importedData.memos || []),
    prompts: mergeByUpdatedAt(
      localData.prompts || [],
      importedData.prompts || []
    ),
    folders: mergeByUpdatedAt(
      localData.folders || [],
      importedData.folders || []
    ),
  };
}

module.exports = {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  createBackupPayload,
  serializeBackup,
  parseBackup,
  mergeByUpdatedAt,
  mergeBackupData,
};
