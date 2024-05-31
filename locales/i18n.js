import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

const deviceLanguage = getLocales()[0].languageCode;

const i18n = new I18n({
  en: {
    add: "Add",
    copy: "Copy",
    delete: "Delete",
    modify: "Modify",
    cancel: "Cancel",
    warning: "Please enter the memo.",
    memoEmpty: "Try adding a memo.",
    memoPlaceholder: "Enter your memo here.",
  },
  ko: {
    add: "추가",
    copy: "복사",
    delete: "삭제",
    modify: "수정",
    cancel: "취소",
    warning: "메모를 입력해주세요.",
    memoEmpty: "메모를 추가해주세요.",
    memoPlaceholder: "메모를 입력해주세요.",
  },
  zh: {
    add: "添加",
    copy: "复制",
    delete: "删除",
    modify: "修改",
    cancel: "取消",
    warning: "请输入备忘录。",
    memoEmpty: "请添加备忘录。",
    memoPlaceholder: "在此输入备忘录。",
  },
  ja: {
    add: "追加",
    copy: "コピー",
    delete: "削除",
    modify: "修正",
    cancel: "キャンセル",
    warning: "メモを入力してください。",
    memoEmpty: "メモを追加してみてください。",
    memoPlaceholder: "ここにメモを入力してください。",
  },
});

if (
  deviceLanguage === "en" ||
  deviceLanguage === "ko" ||
  deviceLanguage === "zh" ||
  deviceLanguage === "ja"
) {
  i18n.locale = deviceLanguage;
} else {
  i18n.defaultLocale = "en";
}

export default i18n;
