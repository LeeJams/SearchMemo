import AsyncStorage from "@react-native-async-storage/async-storage";
import "expo-sqlite/localStorage/install";

const {
  createMemo,
  updateMemo,
  parseStoredMemos,
  formatMemoDateFromIso,
  mergePromptsIntoMemos,
} = require("./memoModel");
const { parseStoredPrompts } = require("./promptModel");

const MEMOS_STORAGE_KEY = "memofind.memos.v3";
const LEGACY_MEMOS_STORAGE_KEY = "memos";
const LEGACY_PROMPTS_STORAGE_KEY = "prompts";

export async function getMemos() {
  try {
    const currentValue = localStorage.getItem(MEMOS_STORAGE_KEY);
    if (currentValue !== null) {
      return parseStoredMemos(currentValue);
    }

    const [legacyMemoValue, legacyPromptValue] = await Promise.all([
      AsyncStorage.getItem(LEGACY_MEMOS_STORAGE_KEY),
      AsyncStorage.getItem(LEGACY_PROMPTS_STORAGE_KEY),
    ]);
    const migratedMemos = mergePromptsIntoMemos(
      parseStoredMemos(legacyMemoValue),
      parseStoredPrompts(legacyPromptValue)
    );

    localStorage.setItem(MEMOS_STORAGE_KEY, JSON.stringify(migratedMemos));
    await AsyncStorage.multiRemove([
      LEGACY_MEMOS_STORAGE_KEY,
      LEGACY_PROMPTS_STORAGE_KEY,
    ]);
    return migratedMemos;
  } catch (e) {
    console.error("Failed to fetch memos from storage", e);
    return [];
  }
}

export async function storeMemos(memos) {
  try {
    localStorage.setItem(MEMOS_STORAGE_KEY, JSON.stringify(memos));
    return true;
  } catch (e) {
    console.error("Failed to store memos in storage", e);
    return false;
  }
}

export function buildMemo(memoData) {
  return createMemo(memoData);
}

export function buildUpdatedMemo(existingMemo, memoData) {
  return updateMemo(existingMemo, memoData);
}

export function getCurrentDate() {
  return formatMemoDateFromIso(new Date().toISOString());
}
