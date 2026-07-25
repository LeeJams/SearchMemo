const FOLDER_SCHEMA_VERSION = 1;

function normalizeFolderName(name) {
  return typeof name === "string" ? name.trim() : "";
}

function createIsoTimestamp(now = () => new Date()) {
  const value = now();
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function normalizeTimestamp(value, fallback) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function createFolderId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `folder-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createFolder(
  folderData,
  { now = () => new Date(), idFactory = createFolderId } = {}
) {
  const name = normalizeFolderName(folderData?.name);
  if (!name) {
    throw new Error("folder-name-required");
  }
  const timestamp = createIsoTimestamp(now);
  return {
    schemaVersion: FOLDER_SCHEMA_VERSION,
    id: String(idFactory()),
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function renameFolder(existingFolder, name, { now = () => new Date() } = {}) {
  const normalizedName = normalizeFolderName(name);
  if (!normalizedName) {
    throw new Error("folder-name-required");
  }
  const updatedAt = createIsoTimestamp(now);
  return {
    ...existingFolder,
    schemaVersion: FOLDER_SCHEMA_VERSION,
    name: normalizedName,
    createdAt: existingFolder?.createdAt || updatedAt,
    updatedAt,
  };
}

function migrateFolder(folder, { now = () => new Date() } = {}) {
  if (!folder || typeof folder !== "object") {
    return null;
  }
  const name = normalizeFolderName(folder.name);
  if (!name) {
    return null;
  }
  const fallback = createIsoTimestamp(now);
  const createdAt = normalizeTimestamp(folder.createdAt, fallback);
  const updatedAt = normalizeTimestamp(folder.updatedAt, createdAt);
  return {
    schemaVersion: FOLDER_SCHEMA_VERSION,
    id: String(folder.id || createFolderId()),
    name,
    createdAt,
    updatedAt,
  };
}

function migrateFolderCollection(folders, options) {
  if (!Array.isArray(folders)) {
    return [];
  }
  const names = new Set();
  return folders
    .map((folder) => migrateFolder(folder, options))
    .filter((folder) => {
      if (!folder) return false;
      const key = folder.name.toLocaleLowerCase();
      if (names.has(key)) return false;
      names.add(key);
      return true;
    });
}

function parseStoredFolders(value, options) {
  if (!value) {
    return [];
  }
  try {
    return migrateFolderCollection(JSON.parse(value), options);
  } catch (error) {
    return [];
  }
}

function isFolderNameAvailable(folders, name, excludingId = null) {
  const key = normalizeFolderName(name).toLocaleLowerCase();
  if (!key) {
    return false;
  }
  return !folders.some(
    (folder) =>
      folder.id !== excludingId &&
      normalizeFolderName(folder.name).toLocaleLowerCase() === key
  );
}

module.exports = {
  FOLDER_SCHEMA_VERSION,
  normalizeFolderName,
  createFolder,
  renameFolder,
  migrateFolderCollection,
  parseStoredFolders,
  isFolderNameAvailable,
};
