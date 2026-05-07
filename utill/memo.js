import AsyncStorage from "@react-native-async-storage/async-storage";

const {
  createMemo,
  updateMemo,
  parseStoredMemos,
  formatMemoDateFromIso,
} = require("./memoModel");

const MEMOS_STORAGE_KEY = "memos";

export async function getMemos() {
  try {
    const jsonValue = await AsyncStorage.getItem(MEMOS_STORAGE_KEY);
    return parseStoredMemos(jsonValue);
  } catch (e) {
    console.error("Failed to fetch memos from storage", e);
    return [];
  }
}

export async function storeMemos(memos) {
  try {
    const jsonValue = JSON.stringify(memos);
    await AsyncStorage.setItem(MEMOS_STORAGE_KEY, jsonValue);
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
