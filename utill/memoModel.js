const MEMO_SCHEMA_VERSION = 2;
const DEFAULT_MEMO_COLOR = "#e6e6e6";

function normalizeMemoText(text) {
  return typeof text === "string" ? text.trim() : "";
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

module.exports = {
  MEMO_SCHEMA_VERSION,
  DEFAULT_MEMO_COLOR,
  normalizeMemoText,
  createMemo,
  updateMemo,
  migrateMemoCollection,
  parseStoredMemos,
  formatMemoDateFromIso,
};
