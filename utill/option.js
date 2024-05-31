import i18n from "../locales/i18n";

export const actionOptions = [
  {
    label: "Google",
    icon: "google",
    key: "google",
    color: "#0357c4",
    baseUrl: "https://www.google.com/search?q=",
  },
  {
    label: "Youtube",
    icon: "youtube",
    key: "youtube",
    color: "#FF0000",
    baseUrl: "https://www.youtube.com/results?search_query=",
  },
  {
    label: "Naver",
    icon: "neos",
    key: "naver",
    color: "#03c75a",
    baseUrl: "https://search.naver.com/search.naver?query=",
  },
  {
    label: "Bing",
    icon: "microsoft",
    key: "bing",
    color: "#2FA4E7",
    baseUrl: "https://www.bing.com/search?q=",
  },
  {
    label: "Pinterest",
    icon: "pinterest",
    key: "pinterest",
    color: "#FF0000",
    baseUrl: "https://www.pinterest.co.kr/search/pins/?q=",
  },
  {
    label: "Reddit",
    icon: "reddit",
    key: "reddit",
    color: "#ff4500",
    baseUrl: "https://www.reddit.com/search/?q=",
  },
  {
    label: i18n.t("copy"),
    icon: "copy",
    key: "copy",
    color: "#000",
  },
  {
    label: i18n.t("modify"),
    icon: "edit",
    key: "edit",
    color: "#000",
  },
  {
    label: i18n.t("delete"),
    icon: "eraser",
    key: "delete",
    color: "#000",
  },
];

export const colorOptions = [
  "#e6e6e6",
  "#fa5252",
  "#fae952",
  "#fab452",
  "#52c2fa",
  "#8452fa",
];
