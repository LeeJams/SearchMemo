const SEARCH_OPTIONS_VERSION = "3";

const primaryAIServiceKeys = ["chatgpt", "claude", "gemini", "grok"];

const legacyDefaultSelectedSearchOptions = [
  "google",
  "youtube",
  "bing",
  "chatgpt",
  "gemini",
  "perplexity",
];

const defaultSelectedSearchOptions = [
  ...primaryAIServiceKeys,
  "google",
  "youtube",
  "bing",
];

const allSearchOptionKeys = [
  "google",
  "youtube",
  "bing",
  "pinterest",
  "reddit",
  "brave",
  "chatgpt",
  "claude",
  "gemini",
  "grok",
  "perplexity",
  "copilot",
  "deepseek",
  "scholar",
  "semanticScholar",
  "naver",
  "daum",
  "baidu",
  "yahoojp",
  "yandex",
  "duckduckgo",
  "yahoo",
  "googlein",
  "ecosia",
];

function sanitizeSelectedSearchOptions(selectedKeys) {
  if (!Array.isArray(selectedKeys)) {
    return [...defaultSelectedSearchOptions];
  }

  const uniqueKnownKeys = selectedKeys.filter(
    (key, index) =>
      allSearchOptionKeys.includes(key) && selectedKeys.indexOf(key) === index
  );

  return uniqueKnownKeys.length > 0 ? uniqueKnownKeys : [...defaultSelectedSearchOptions];
}

function migrateSelectedSearchOptions(selectedKeys, storedVersion) {
  const sanitized = sanitizeSelectedSearchOptions(selectedKeys);
  let previousDefaults = null;
  if (!storedVersion) {
    previousDefaults = legacyDefaultSelectedSearchOptions;
  } else if (storedVersion === "2") {
    previousDefaults = [...defaultSelectedSearchOptions, "perplexity"];
  }

  if (
    previousDefaults &&
    sanitized.length === previousDefaults.length &&
    previousDefaults.every((key) => sanitized.includes(key))
  ) {
    return [...defaultSelectedSearchOptions];
  }

  return sanitized;
}

module.exports = {
  SEARCH_OPTIONS_VERSION,
  allSearchOptionKeys,
  defaultSelectedSearchOptions,
  primaryAIServiceKeys,
  migrateSelectedSearchOptions,
  sanitizeSelectedSearchOptions,
};
