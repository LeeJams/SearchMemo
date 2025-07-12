import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "user-language";

const translations = {
  en: {
    add: "Add",
    copy: "Copy",
    delete: "Delete",
    modify: "Modify",
    cancel: "Cancel",
    warning: "Please enter the memo.",
    memoEmpty: "Try adding a memo.",
    memoPlaceholder: "Enter your memo here.",
    settings: "Settings",
    theme: "Change Theme",
    search: "Search Memos",
    searchOptionsTitle: "Search Engine Settings",
    saving: "Saving...",
    save: "Save",
    writeMemo: "Write Memo",
    regionGlobal: "Global",
    regionAI: "AI Assistant",
    regionKR: "Korea",
    regionCN: "China",
    regionJP: "Japan",
    regionUS: "USA",
    regionRU: "Russia",
    regionIN: "India",
    regionDE: "Germany",
    regionFR: "France",
    searchOptionsDescription:
      "Choose the search engines to use for web searches of your memos. Only selected engines will appear in the search list. You must select at least one.",
    language: "Language",
    searchOptionsWarning: "You must select at least one search engine.",
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
    settings: "설정",
    theme: "테마 변경",
    search: "메모 검색",
    searchOptionsTitle: "메모 검색 설정",
    saving: "저장중...",
    save: "저장",
    writeMemo: "메모 작성",
    regionGlobal: "글로벌",
    regionAI: "AI 어시스턴트",
    regionKR: "한국",
    regionCN: "중국",
    regionJP: "일본",
    regionUS: "미국",
    regionRU: "러시아",
    regionIN: "인도",
    regionDE: "독일",
    regionFR: "프랑스",
    searchOptionsDescription:
      "메모를 웹에서 검색할 때 사용할 검색 엔진을 고르세요. 선택한 검색 엔진만 검색 목록에 표시됩니다. 최소 1개 이상 선택해야 합니다.",
    language: "언어",
    searchOptionsWarning: "하나 이상의 검색 엔진을 선택해야 합니다.",
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
    settings: "设置",
    theme: "更改主题",
    search: "搜索备忘录",
    searchOptionsTitle: "搜索引擎设置",
    saving: "保存中...",
    save: "保存",
    writeMemo: "撰写备忘录",
    regionGlobal: "全球",
    regionAI: "人工智能助理",
    regionKR: "韩国",
    regionCN: "中国",
    regionJP: "日本",
    regionUS: "美国",
    regionRU: "俄国",
    regionIN: "印度",
    regionDE: "德国",
    regionFR: "法国",
    searchOptionsDescription:
      "请选择用于网络搜索备忘录的搜索引擎。只有选定的引擎会出现在搜索列表中。必须至少选择一个。",
    language: "语言",
    searchOptionsWarning: "您必须至少选择一个搜索引擎。",
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
    settings: "設定",
    theme: "テーマ変更",
    search: "メモ検索",
    searchOptionsTitle: "検索エンジン設定",
    saving: "保存中...",
    save: "保存",
    writeMemo: "メモ作成",
    regionGlobal: "グローバル",
    regionAI: "AIアシスタント",
    regionKR: "韓国",
    regionCN: "中国",
    regionJP: "日本",
    regionUS: "アメリカ",
    regionRU: "ロシア",
    regionIN: "インド",
    regionDE: "ドイツ",
    regionFR: "フランス",
    searchOptionsDescription:
      "メモをウェブ検索する際に使用する検索エンジンを選択してください。選択したエンジンのみが検索リストに表示されます。少なくとも1つ選択する必要があります。",
    language: "言語",
    searchOptionsWarning:
      "少なくとも1つの検索エンジンを選択する必要があります。",
  },
  de: {
    add: "Hinzufügen",
    copy: "Kopieren",
    delete: "Löschen",
    modify: "Ändern",
    cancel: "Abbrechen",
    warning: "Bitte Memo eingeben.",
    memoEmpty: "Fügen Sie ein Memo hinzu.",
    memoPlaceholder: "Geben Sie hier Ihr Memo ein.",
    settings: "Einstellungen",
    theme: "Thema ändern",
    search: "Memos durchsuchen",
    searchOptionsTitle: "Suchmaschineneinstellungen",
    saving: "Speichern...",
    save: "Speichern",
    writeMemo: "Memo schreiben",
    regionGlobal: "Global",
    regionAI: "KI-Assistent",
    regionKR: "Korea",
    regionCN: "China",
    regionJP: "Japan",
    regionUS: "USA",
    regionRU: "Russland",
    regionIN: "Indien",
    regionDE: "Deutschland",
    regionFR: "Frankreich",
    searchOptionsDescription:
      "Wählen Sie die Suchmaschinen aus, die Sie für die Websuche Ihrer Notizen verwenden möchten. Nur ausgewählte Suchmaschinen werden in der Suchliste angezeigt. Sie müssen mindestens eine auswählen.",
    language: "Sprache",
    searchOptionsWarning: "Sie müssen mindestens eine Suchmaschine auswählen.",
  },
  ru: {
    add: "Добавить",
    copy: "Копировать",
    delete: "Удалить",
    modify: "Изменить",
    cancel: "Отмена",
    warning: "Пожалуйста, введите заметку.",
    memoEmpty: "Добавьте заметку.",
    memoPlaceholder: "Введите свою заметку здесь.",
    settings: "Настройки",
    theme: "Сменить тему",
    search: "Поиск заметок",
    searchOptionsTitle: "Настройки поисковой системы",
    saving: "Сохранение...",
    save: "Сохранить",
    writeMemo: "Написать заметку",
    regionGlobal: "Глобальный",
    regionAI: "ИИ-ассистент",
    regionKR: "Корея",
    regionCN: "Китай",
    regionJP: "Япония",
    regionUS: "США",
    regionRU: "Россия",
    regionIN: "Индия",
    regionDE: "Германия",
    regionFR: "Франция",
    searchOptionsDescription:
      "Выберите поисковые системы для веб-поиска ваших заметок. В списке поиска появятся только выбранные системы. Вы должны выбрать хотя бы одну.",
    language: "Язык",
    searchOptionsWarning: "Вы должны выбрать хотя бы одну поисковую систему.",
  },
  hi: {
    add: "जोड़ें",
    copy: "कॉपी करें",
    delete: "हटाएं",
    modify: "संशोधित करें",
    cancel: "रद्द करें",
    warning: "कृपया मेमो दर्ज करें।",
    memoEmpty: "एक मेमो जोड़ें।",
    memoPlaceholder: "अपना मेमो यहाँ दर्ज करें।",
    settings: "सेटिंग्स",
    theme: "थीम बदलें",
    search: "मेमो खोजें",
    searchOptionsTitle: "खोज इंजन सेटिंग्स",
    saving: "सहेज रहा है...",
    save: "सहेजें",
    writeMemo: "मेमो लिखें",
    regionGlobal: "वैश्विक",
    regionAI: "एआई सहायक",
    regionKR: "कोरिया",
    regionCN: "चीन",
    regionJP: "जापान",
    regionUS: "अमेरीका",
    regionRU: "रूस",
    regionIN: "भारत",
    regionDE: "जर्मनी",
    regionFR: "फ्रांस",
    searchOptionsDescription:
      "अपने मेमो की वेब खोज के लिए उपयोग करने वाले खोज इंजन चुनें। खोज सूची में केवल चयनित इंजन ही दिखाई देंगे। आपको कम से कम एक का चयन करना होगा।",
    language: "भाषा",
    searchOptionsWarning: "आपको कम से कम एक खोज इंजन का चयन करना होगा।",
  },
};

const i18n = new I18n(translations);
const supportedLocales = Object.keys(translations);

// 앱 시작 시 저장된 언어 설정 불러오기
(async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      i18n.locale = savedLanguage;
    } else {
      const deviceLanguage = getLocales()[0]?.languageCode;
      i18n.locale = supportedLocales.includes(deviceLanguage)
        ? deviceLanguage
        : "en";
    }
  } catch (error) {
    console.error(
      "Failed to load language from storage, falling back to default.",
      error
    );
    const deviceLanguage = getLocales()[0]?.languageCode;
    i18n.locale = supportedLocales.includes(deviceLanguage)
      ? deviceLanguage
      : "en";
  }
})();

i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default i18n;
