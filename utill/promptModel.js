const PROMPT_SCHEMA_VERSION = 1;
const DEFAULT_PROMPT_TITLE = "Untitled prompt";

function normalizePromptBody(body) {
  return typeof body === "string" ? body.trim() : "";
}

function normalizePromptTitle(title, body) {
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  if (normalizedTitle) {
    return normalizedTitle;
  }

  const firstLine = normalizePromptBody(body)
    .split(/\r?\n/)
    .find((line) => line.trim());
  return firstLine?.trim().slice(0, 80) || DEFAULT_PROMPT_TITLE;
}

function normalizePromptTags(tags) {
  const values = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(",")
    : [];
  const seen = new Set();

  return values
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter((tag) => {
      if (!tag) return false;
      const key = tag.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function createIsoTimestamp(now = () => new Date()) {
  const value = now();
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function normalizeTimestamp(value, fallback) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function createPromptId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createPrompt(
  promptData,
  { now = () => new Date(), idFactory = createPromptId } = {}
) {
  const timestamp = createIsoTimestamp(now);
  const body = normalizePromptBody(promptData?.body);

  return {
    schemaVersion: PROMPT_SCHEMA_VERSION,
    id: String(idFactory()),
    title: normalizePromptTitle(promptData?.title, body),
    body,
    tags: normalizePromptTags(promptData?.tags),
    favorite: Boolean(promptData?.favorite),
    createdAt: timestamp,
    updatedAt: timestamp,
    lastUsedAt: null,
  };
}

function updatePrompt(existingPrompt, promptData, { now = () => new Date() } = {}) {
  const updatedAt = createIsoTimestamp(now);
  const body = normalizePromptBody(promptData?.body);

  return {
    ...existingPrompt,
    schemaVersion: PROMPT_SCHEMA_VERSION,
    title: normalizePromptTitle(promptData?.title, body),
    body,
    tags: normalizePromptTags(promptData?.tags),
    favorite: Boolean(existingPrompt?.favorite),
    createdAt: existingPrompt?.createdAt || updatedAt,
    updatedAt,
    lastUsedAt: existingPrompt?.lastUsedAt || null,
  };
}

function setPromptFavorite(prompt, favorite) {
  return {
    ...prompt,
    favorite: Boolean(favorite),
  };
}

function markPromptUsed(prompt, { now = () => new Date() } = {}) {
  return {
    ...prompt,
    lastUsedAt: createIsoTimestamp(now),
  };
}

function migratePrompt(prompt, { now = () => new Date() } = {}) {
  if (!prompt || typeof prompt !== "object") {
    return null;
  }

  const body = normalizePromptBody(prompt.body);
  if (!body) {
    return null;
  }

  const fallback = createIsoTimestamp(now);
  const createdAt = normalizeTimestamp(prompt.createdAt, fallback);
  const updatedAt = normalizeTimestamp(prompt.updatedAt, createdAt);
  const lastUsedAt = prompt.lastUsedAt
    ? normalizeTimestamp(prompt.lastUsedAt, null)
    : null;

  return {
    schemaVersion: PROMPT_SCHEMA_VERSION,
    id: String(prompt.id || createPromptId()),
    title: normalizePromptTitle(prompt.title, body),
    body,
    tags: normalizePromptTags(prompt.tags),
    favorite: Boolean(prompt.favorite),
    createdAt,
    updatedAt,
    lastUsedAt,
  };
}

function migratePromptCollection(prompts, options) {
  if (!Array.isArray(prompts)) {
    return [];
  }
  return prompts
    .map((prompt) => migratePrompt(prompt, options))
    .filter(Boolean);
}

function parseStoredPrompts(jsonValue, options) {
  if (!jsonValue) {
    return [];
  }
  try {
    return migratePromptCollection(JSON.parse(jsonValue), options);
  } catch (error) {
    return [];
  }
}

function promptRecency(prompt) {
  return new Date(
    prompt.lastUsedAt || prompt.updatedAt || prompt.createdAt || 0
  ).getTime();
}

function filterAndSortPrompts(
  prompts,
  { query = "", tag = null, favoritesOnly = false } = {}
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return [...prompts]
    .filter((prompt) => {
      if (favoritesOnly && !prompt.favorite) return false;
      if (tag && !prompt.tags.includes(tag)) return false;
      if (!normalizedQuery) return true;

      return [prompt.title, prompt.body, ...prompt.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    })
    .sort((a, b) => {
      if (a.favorite !== b.favorite) {
        return a.favorite ? -1 : 1;
      }
      return promptRecency(b) - promptRecency(a);
    });
}

function getPromptTags(prompts) {
  return normalizePromptTags(prompts.flatMap((prompt) => prompt.tags)).sort(
    (a, b) => a.localeCompare(b)
  );
}

module.exports = {
  PROMPT_SCHEMA_VERSION,
  DEFAULT_PROMPT_TITLE,
  normalizePromptBody,
  normalizePromptTitle,
  normalizePromptTags,
  createPrompt,
  updatePrompt,
  setPromptFavorite,
  markPromptUsed,
  migratePromptCollection,
  parseStoredPrompts,
  filterAndSortPrompts,
  getPromptTags,
};
