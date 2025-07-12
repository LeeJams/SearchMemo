import i18n from "../locales/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCH_OPTIONS_KEY = "selectedSearchOptions";

// 모든 검색 옵션들 (사용자가 선택할 수 있는 전체 목록)
export const allSearchOptions = [
  // 글로벌
  {
    label: "Google",
    key: "google",
    baseUrl: "https://www.google.com/search?q=",
    region: "global",
  },
  {
    label: "Youtube",
    key: "youtube",
    baseUrl: "https://www.youtube.com/results?search_query=",
    region: "global",
  },
  {
    label: "Bing",
    key: "bing",
    baseUrl: "https://www.bing.com/search?q=",
    region: "global",
  },
  {
    label: "Pinterest",
    key: "pinterest",
    baseUrl: "https://www.pinterest.co.kr/search/pins/?q=",
    region: "global",
  },
  {
    label: "Reddit",
    key: "reddit",
    baseUrl: "https://www.reddit.com/search/?q=",
    region: "global",
  },
  // AI 서비스
  {
    label: "ChatGPT",
    key: "chatgpt",
    baseUrl: "https://chat.openai.com",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Claude",
    key: "claude",
    baseUrl: "https://claude.ai",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Gemini",
    key: "gemini",
    baseUrl: "https://gemini.google.com",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Grok",
    key: "grok",
    baseUrl: "https://x.com/i/grok",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Perplexity",
    key: "perplexity",
    baseUrl: "https://www.perplexity.ai",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  // 한국
  {
    label: "Naver",
    key: "naver",
    baseUrl: "https://search.naver.com/search.naver?query=",
    region: "kr",
  },
  {
    label: "Daum",
    key: "daum",
    baseUrl: "https://search.daum.net/search?q=",
    region: "kr",
  },
  // 중국
  {
    label: "Baidu",
    key: "baidu",
    baseUrl: "https://www.baidu.com/s?wd=",
    region: "cn",
  },
  // 일본
  {
    label: "Yahoo JP",
    key: "yahoojp",
    baseUrl: "https://search.yahoo.co.jp/search?p=",
    region: "jp",
  },
  // 러시아
  {
    label: "Yandex",
    key: "yandex",
    baseUrl: "https://yandex.com/search/?text=",
    region: "ru",
  },
  // 미국/유럽
  {
    label: "DuckDuckGo",
    key: "duckduckgo",
    baseUrl: "https://duckduckgo.com/?q=",
    region: "us",
  },
  {
    label: "Yahoo",
    key: "yahoo",
    baseUrl: "https://search.yahoo.com/search?p=",
    region: "us",
  },
  // 인도
  {
    label: "Google India",
    key: "googlein",
    baseUrl: "https://www.google.co.in/search?q=",
    region: "in",
  },
  // 독일
  {
    label: "Ecosia",
    key: "ecosia",
    baseUrl: "https://www.ecosia.org/search?method=index&q=",
    region: "de",
  },
];

// 액션 옵션들 (복사, 수정, 삭제)
export const getFixedActionOptions = () => [
  {
    label: i18n.t("copy"),
    key: "copy",
  },
  {
    label: i18n.t("modify"),
    key: "edit",
  },
  {
    label: i18n.t("delete"),
    key: "delete",
  },
];

// 기본 선택된 검색 옵션들 (초기값)
export const defaultSelectedSearchOptions = [
  "google",
  "youtube",
  "bing",
  "chatgpt",
  "gemini",
  "perplexity",
];

// 기존 actionOptions (호환성을 위해 유지, 나중에 deprecated)
export const actionOptions = [
  ...allSearchOptions.filter((opt) =>
    defaultSelectedSearchOptions.includes(opt.key)
  ),
  ...getFixedActionOptions(),
];

export const colorOptions = [
  "#e6e6e6",
  "#fa5252",
  "#fae952",
  "#fab452",
  "#52c2fa",
  "#8452fa",
];

// AsyncStorage 관련 함수들
export const getSelectedSearchOptions = async () => {
  try {
    const saved = await AsyncStorage.getItem(SEARCH_OPTIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // 저장된 값이 없으면 초기값 저장하고 반환
    await AsyncStorage.setItem(
      SEARCH_OPTIONS_KEY,
      JSON.stringify(defaultSelectedSearchOptions)
    );
    return defaultSelectedSearchOptions;
  } catch (error) {
    console.error("Failed to get search options:", error);
    return defaultSelectedSearchOptions;
  }
};

export const saveSelectedSearchOptions = async (selectedKeys) => {
  try {
    await AsyncStorage.setItem(
      SEARCH_OPTIONS_KEY,
      JSON.stringify(selectedKeys)
    );
    return true;
  } catch (error) {
    console.error("Failed to save search options:", error);
    return false;
  }
};

export const getActionOptions = async () => {
  try {
    const selectedKeys = await getSelectedSearchOptions();
    const selectedSearchOptions = allSearchOptions.filter((opt) =>
      selectedKeys.includes(opt.key)
    );
    return [...selectedSearchOptions, ...getFixedActionOptions()];
  } catch (error) {
    console.error("Failed to get action options:", error);
    return actionOptions; // 기본값 반환
  }
};
