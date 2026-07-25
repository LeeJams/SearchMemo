import "expo-sqlite/localStorage/install";

const {
  createFolder,
  renameFolder,
  migrateFolderCollection,
  parseStoredFolders,
} = require("./folderModel");

const FOLDERS_STORAGE_KEY = "memofind.folders.v1";

export async function getFolders() {
  try {
    return parseStoredFolders(localStorage.getItem(FOLDERS_STORAGE_KEY));
  } catch (error) {
    console.error("Failed to fetch folders from storage", error);
    return [];
  }
}

export async function storeFolders(folders) {
  try {
    localStorage.setItem(
      FOLDERS_STORAGE_KEY,
      JSON.stringify(migrateFolderCollection(folders))
    );
    return true;
  } catch (error) {
    console.error("Failed to store folders", error);
    return false;
  }
}

export function buildFolder(folderData) {
  return createFolder(folderData);
}

export function buildRenamedFolder(existingFolder, name) {
  return renameFolder(existingFolder, name);
}
