import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getMemos() {
  try {
    const jsonValue = await AsyncStorage.getItem("memos");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch memos from storage", e);
    throw e;
  }
}

export async function storeMemos(memos) {
  try {
    const jsonValue = JSON.stringify(memos);
    await AsyncStorage.setItem("memos", jsonValue);
  } catch (e) {
    console.error("Failed to store memos in storage", e);
    throw e;
  }
}

export function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}
