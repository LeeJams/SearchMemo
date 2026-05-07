const defaultSelectedSearchOptions = [
  "google",
  "youtube",
  "bing",
  "chatgpt",
  "gemini",
  "perplexity",
];

const allSearchOptionKeys = [
  "google",
  "youtube",
  "bing",
  "pinterest",
  "reddit",
  "chatgpt",
  "claude",
  "gemini",
  "grok",
  "perplexity",
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

module.exports = {
  allSearchOptionKeys,
  defaultSelectedSearchOptions,
  sanitizeSelectedSearchOptions,
};
