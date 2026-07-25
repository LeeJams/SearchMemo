const MEMO_SCHEMA_VERSION = 3;
const MEMO_MAX_LENGTH = 20000;
const MEMO_LIST_MAX_LINES = 3;
const DEFAULT_MEMO_COLOR = "#e6e6e6";
const PROMPTS_FOLDER_ID = "prompts";

function normalizeMemoText(text) {
  return typeof text === "string"
    ? text.trim().slice(0, MEMO_MAX_LENGTH)
    : "";
}

function normalizeFolderId(folderId) {
  if (folderId === null || folderId === undefined) {
    return null;
  }
  const normalized = String(folderId).trim();
  return normalized || null;
}

function createIsoTimestamp(now = () => new Date()) {
  const value = now();
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function createMemoId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatMemoDateFromIso(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return formatMemoDateFromIso(new Date().toISOString());
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}

function parseLegacyDisplayDate(displayDate, fallbackIso) {
  if (typeof displayDate !== "string") {
    return fallbackIso;
  }
  const match = displayDate.match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
  if (!match) {
    return fallbackIso;
  }
  const [, year, month, day] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    0,
    0,
    0,
    0
  ).toISOString();
}

function createMemo(memoData, { now = () => new Date(), idFactory = createMemoId } = {}) {
  const timestamp = createIsoTimestamp(now);
  const text = normalizeMemoText(memoData?.text);

  return {
    schemaVersion: MEMO_SCHEMA_VERSION,
    id: String(idFactory()),
    text,
    color: memoData?.color || DEFAULT_MEMO_COLOR,
    createdAt: timestamp,
    updatedAt: timestamp,
    date: formatMemoDateFromIso(timestamp),
    favorite: Boolean(memoData?.favorite),
    tags: Array.isArray(memoData?.tags) ? memoData.tags : [],
    folderId: normalizeFolderId(memoData?.folderId),
  };
}

function updateMemo(existingMemo, memoData, { now = () => new Date() } = {}) {
  const updatedAt = createIsoTimestamp(now);
  const createdAt = existingMemo?.createdAt || updatedAt;

  return {
    ...existingMemo,
    schemaVersion: MEMO_SCHEMA_VERSION,
    text: normalizeMemoText(memoData?.text),
    color: memoData?.color || existingMemo?.color || DEFAULT_MEMO_COLOR,
    createdAt,
    updatedAt,
    date: formatMemoDateFromIso(updatedAt),
    favorite: Boolean(existingMemo?.favorite),
    tags: Array.isArray(existingMemo?.tags) ? existingMemo.tags : [],
    folderId: Object.prototype.hasOwnProperty.call(memoData || {}, "folderId")
      ? normalizeFolderId(memoData.folderId)
      : normalizeFolderId(existingMemo?.folderId),
  };
}

function migrateMemo(memo, { now = () => new Date() } = {}) {
  if (!memo || typeof memo !== "object") {
    return null;
  }

  const fallbackIso = createIsoTimestamp(now);
  const createdAt = memo.createdAt || parseLegacyDisplayDate(memo.date, fallbackIso);
  const updatedAt = memo.updatedAt || createdAt;
  const text = normalizeMemoText(memo.text);

  if (!text) {
    return null;
  }

  return {
    schemaVersion: MEMO_SCHEMA_VERSION,
    id: String(memo.id || createMemoId()),
    text,
    color: memo.color || DEFAULT_MEMO_COLOR,
    createdAt,
    updatedAt,
    date: formatMemoDateFromIso(updatedAt),
    favorite: Boolean(memo.favorite),
    tags: Array.isArray(memo.tags) ? memo.tags : [],
    folderId: normalizeFolderId(memo.folderId),
  };
}

function migrateMemoCollection(memos, options) {
  if (!Array.isArray(memos)) {
    return [];
  }
  return memos.map((memo) => migrateMemo(memo, options)).filter(Boolean);
}

function parseStoredMemos(jsonValue, options) {
  if (!jsonValue) {
    return [];
  }
  try {
    return migrateMemoCollection(JSON.parse(jsonValue), options);
  } catch (error) {
    return [];
  }
}

function getMemoTitle(text) {
  return (
    normalizeMemoText(text)
      .split(/\r?\n/)
      .find((line) => line.trim())
      ?.trim() || ""
  );
}

function getMemoPreview(text) {
  const lines = normalizeMemoText(text).split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => line.trim());
  if (titleIndex < 0) {
    return "";
  }
  return lines
    .slice(titleIndex + 1)
    .join("\n")
    .trim();
}

function getMemoListContent(text) {
  return normalizeMemoText(text);
}

function filterMemos(memos, { query = "", folderId = "all" } = {}) {
  if (!Array.isArray(memos)) {
    return [];
  }
  const normalizedQuery =
    typeof query === "string" ? query.trim().toLocaleLowerCase() : "";

  return memos.filter((memo) => {
    const memoFolderId = normalizeFolderId(memo?.folderId);
    if (folderId !== "all" && memoFolderId !== normalizeFolderId(folderId)) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return [memo?.text, ...(Array.isArray(memo?.tags) ? memo.tags : [])]
      .filter((value) => typeof value === "string")
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });
}

function validTimestamp(value, fallback) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function promptText(prompt) {
  const body = normalizeMemoText(prompt?.body);
  const title = typeof prompt?.title === "string" ? prompt.title.trim() : "";
  const firstLine = getMemoTitle(body);
  if (!title || title === firstLine) {
    return body;
  }
  return normalizeMemoText(`${title}\n\n${body}`);
}

function promptToMemo(prompt, options = {}) {
  if (!prompt || typeof prompt !== "object" || !normalizeMemoText(prompt.body)) {
    return null;
  }
  const fallback = createIsoTimestamp(options.now);
  const createdAt = validTimestamp(prompt.createdAt, fallback);
  const updatedAt = validTimestamp(prompt.updatedAt, createdAt);

  return {
    schemaVersion: MEMO_SCHEMA_VERSION,
    id: `prompt:${String(prompt.id || createMemoId())}`,
    text: promptText(prompt),
    color: DEFAULT_MEMO_COLOR,
    createdAt,
    updatedAt,
    date: formatMemoDateFromIso(updatedAt),
    favorite: Boolean(prompt.favorite),
    tags: Array.isArray(prompt.tags)
      ? prompt.tags.filter((tag) => typeof tag === "string")
      : [],
    folderId: PROMPTS_FOLDER_ID,
  };
}

function mergePromptsIntoMemos(memos, prompts, options) {
  const migratedMemos = migrateMemoCollection(memos, options);
  const knownIds = new Set(migratedMemos.map((memo) => memo.id));
  const converted = Array.isArray(prompts)
    ? prompts
        .map((prompt) => promptToMemo(prompt, options))
        .filter((memo) => memo && !knownIds.has(memo.id))
    : [];
  return [...converted, ...migratedMemos];
}

module.exports = {
  MEMO_SCHEMA_VERSION,
  MEMO_MAX_LENGTH,
  MEMO_LIST_MAX_LINES,
  DEFAULT_MEMO_COLOR,
  PROMPTS_FOLDER_ID,
  normalizeMemoText,
  createMemo,
  updateMemo,
  migrateMemoCollection,
  parseStoredMemos,
  formatMemoDateFromIso,
  getMemoTitle,
  getMemoPreview,
  getMemoListContent,
  filterMemos,
  mergePromptsIntoMemos,
};
