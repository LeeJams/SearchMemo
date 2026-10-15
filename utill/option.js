import AsyncStorage from "@react-native-async-storage/async-storage";

const {
  SEARCH_OPTIONS_VERSION,
  defaultSelectedSearchOptions,
  migrateSelectedSearchOptions,
  sanitizeSelectedSearchOptions,
} = require("./optionModel");

const SEARCH_OPTIONS_KEY = "selectedSearchOptions";
const SEARCH_OPTIONS_VERSION_KEY = "selectedSearchOptionsVersion";

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
    label: "YouTube",
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
    baseUrl: "https://www.pinterest.com/search/pins/?q=",
    region: "global",
  },
  {
    label: "Reddit",
    key: "reddit",
    baseUrl: "https://www.reddit.com/search/?q=",
    region: "global",
  },
  {
    label: "Brave Search",
    key: "brave",
    baseUrl: "https://search.brave.com/search?q=",
    region: "global",
  },
  // Provider app links open installed apps; baseUrl remains the web fallback.
  {
    label: "ChatGPT",
    shortLabel: "GPT",
    key: "chatgpt",
    baseUrl: "https://chatgpt.com",
    appUrl: "https://chatgpt.com/#native", // The home Universal Link requires #native.
    prefillUrl: "https://chatgpt.com/?prompt=",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Claude",
    key: "claude",
    baseUrl: "https://claude.ai",
    appUrl: "https://claude.ai/new",
    prefillUrl: "https://claude.ai/new?q=",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Gemini",
    key: "gemini",
    baseUrl: "https://gemini.google.com",
    appUrl: "https://gemini.google.com/app",
    iosAppUrl: "googlegemini://",
    region: "ai",
    copyToClipboard: true, // 클립보드 복사 필요
  },
  {
    label: "Grok",
    key: "grok",
    baseUrl: "https://grok.com",
    appUrl: "https://grok.com/",
    prefillUrl: "https://grok.com/?q=",
    prefillSuffix: "&autoSubmit=false",
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
  {
    label: "Microsoft Copilot",
    shortLabel: "Copilot",
    key: "copilot",
    baseUrl: "https://copilot.com",
    region: "ai",
    copyToClipboard: true,
  },
  {
    label: "DeepSeek",
    key: "deepseek",
    baseUrl: "https://chat.deepseek.com",
    region: "ai",
    copyToClipboard: true,
  },
  // 학술 검색
  {
    label: "Google Scholar",
    key: "scholar",
    baseUrl: "https://scholar.google.com/scholar?q=",
    region: "research",
  },
  {
    label: "Semantic Scholar",
    key: "semanticScholar",
    baseUrl: "https://www.semanticscholar.org/search?q=",
    region: "research",
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

// 기본 선택된 검색 옵션들 (초기값)
export { defaultSelectedSearchOptions };

const defaultActionOptions = allSearchOptions.filter((option) =>
  option.region !== "ai" && defaultSelectedSearchOptions.includes(option.key)
);

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
    const [[, saved], [, storedVersion]] = await AsyncStorage.multiGet([
      SEARCH_OPTIONS_KEY,
      SEARCH_OPTIONS_VERSION_KEY,
    ]);
    const selectedKeys = migrateSelectedSearchOptions(
      saved ? JSON.parse(saved) : null,
      storedVersion
    );
    const serialized = JSON.stringify(selectedKeys);
    if (saved !== serialized || storedVersion !== SEARCH_OPTIONS_VERSION) {
      await AsyncStorage.multiSet([
        [SEARCH_OPTIONS_KEY, serialized],
        [SEARCH_OPTIONS_VERSION_KEY, SEARCH_OPTIONS_VERSION],
      ]);
    }
    return selectedKeys;
  } catch (error) {
    console.error("Failed to get search options:", error);
    return defaultSelectedSearchOptions;
  }
};

export const saveSelectedSearchOptions = async (selectedKeys) => {
  try {
    await AsyncStorage.multiSet([
      [
        SEARCH_OPTIONS_KEY,
        JSON.stringify(sanitizeSelectedSearchOptions(selectedKeys)),
      ],
      [SEARCH_OPTIONS_VERSION_KEY, SEARCH_OPTIONS_VERSION],
    ]);
    return true;
  } catch (error) {
    console.error("Failed to save search options:", error);
    return false;
  }
};

export const getActionOptions = async () => {
  try {
    const selectedKeys = await getSelectedSearchOptions();
    const selectedSearchOptions = selectedKeys
      .map((key) => allSearchOptions.find((opt) => opt.key === key))
      .filter((option) => option && option.region !== "ai");
    return selectedSearchOptions;
  } catch (error) {
    console.error("Failed to get action options:", error);
    return defaultActionOptions;
  }
};

export const getSelectedAIOptions = async () => {
  const selectedKeys = await getSelectedSearchOptions();
  return selectedKeys
    .map((key) => allSearchOptions.find((option) => option.key === key))
    .filter((option) => option?.region === "ai");
};
