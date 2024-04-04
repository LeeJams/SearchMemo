import AsyncStorage from "@react-native-async-storage/async-storage";

export const getMemos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("memos");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const storeMemos = async (memos) => {
  try {
    const jsonValue = JSON.stringify(memos);
    await AsyncStorage.setItem("memos", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getCurrentDate = () => {
  return new Date()
    .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    .substring(0, 10);
};
