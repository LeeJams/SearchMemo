const assert = require("node:assert/strict");
const {
  PROMPT_SCHEMA_VERSION,
  createPrompt,
  updatePrompt,
  markPromptUsed,
  normalizePromptTags,
  migratePromptCollection,
  parseStoredPrompts,
  filterAndSortPrompts,
} = require("../utill/promptModel");

const fixedNow = () => new Date("2026-07-23T10:00:00.000Z");

module.exports = [
  {
    name: "createPrompt normalizes body, title, and duplicate tags",
    test() {
      const prompt = createPrompt(
        {
          title: "",
          body: "  여행 계획을 만들어줘\n조건을 표로 정리해줘  ",
          tags: [" 여행 ", "AI", "ai", ""],
        },
        { now: fixedNow, idFactory: () => "prompt-1" }
      );
      assert.equal(prompt.schemaVersion, PROMPT_SCHEMA_VERSION);
      assert.equal(prompt.id, "prompt-1");
      assert.equal(prompt.title, "여행 계획을 만들어줘");
      assert.equal(prompt.body, "여행 계획을 만들어줘\n조건을 표로 정리해줘");
      assert.deepEqual(prompt.tags, ["여행", "AI"]);
      assert.equal(prompt.favorite, false);
      assert.equal(prompt.lastUsedAt, null);
    },
  },
  {
    name: "updatePrompt preserves createdAt, favorite, and lastUsedAt",
    test() {
      const original = {
        ...createPrompt(
          { title: "초안", body: "초안 본문", tags: [] },
          {
            now: () => new Date("2026-01-01T00:00:00.000Z"),
            idFactory: () => "prompt-2",
          }
        ),
        favorite: true,
        lastUsedAt: "2026-02-01T00:00:00.000Z",
      };
      const updated = updatePrompt(
        original,
        { title: " 수정 ", body: " 새 본문 ", tags: "업무, 정리" },
        { now: fixedNow }
      );
      assert.equal(updated.createdAt, "2026-01-01T00:00:00.000Z");
      assert.equal(updated.updatedAt, "2026-07-23T10:00:00.000Z");
      assert.equal(updated.favorite, true);
      assert.equal(updated.lastUsedAt, "2026-02-01T00:00:00.000Z");
      assert.deepEqual(updated.tags, ["업무", "정리"]);
    },
  },
  {
    name: "prompt search covers title, body, and tags and sorts favorites first",
    test() {
      const prompts = [
        {
          id: "old",
          title: "영문 작성",
          body: "Write an email",
          tags: ["업무"],
          favorite: true,
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "new",
          title: "회의 요약",
          body: "핵심 내용을 정리",
          tags: ["업무"],
          favorite: false,
          updatedAt: "2026-07-01T00:00:00.000Z",
        },
      ];
      assert.deepEqual(
        filterAndSortPrompts(prompts, { tag: "업무" }).map(({ id }) => id),
        ["old", "new"]
      );
      assert.equal(filterAndSortPrompts(prompts, { query: "EMAIL" })[0].id, "old");
      assert.equal(filterAndSortPrompts(prompts, { query: "요약" })[0].id, "new");
    },
  },
  {
    name: "prompt sort uses recent usage before recent modification",
    test() {
      const prompts = [
        {
          id: "recently-edited",
          title: "수정됨",
          body: "본문",
          tags: [],
          favorite: false,
          updatedAt: "2026-07-22T00:00:00.000Z",
          lastUsedAt: null,
        },
        {
          id: "recently-used",
          title: "사용됨",
          body: "본문",
          tags: [],
          favorite: false,
          updatedAt: "2026-01-01T00:00:00.000Z",
          lastUsedAt: "2026-07-23T00:00:00.000Z",
        },
      ];
      assert.deepEqual(
        filterAndSortPrompts(prompts).map(({ id }) => id),
        ["recently-used", "recently-edited"]
      );
    },
  },
  {
    name: "markPromptUsed updates only lastUsedAt",
    test() {
      const original = createPrompt(
        { title: "제목", body: "본문" },
        { now: fixedNow, idFactory: () => "prompt-3" }
      );
      const used = markPromptUsed(original, {
        now: () => new Date("2026-07-24T00:00:00.000Z"),
      });
      assert.equal(used.lastUsedAt, "2026-07-24T00:00:00.000Z");
      assert.equal(used.updatedAt, original.updatedAt);
    },
  },
  {
    name: "prompt migration rejects empty items and storage parser handles invalid json",
    test() {
      const migrated = migratePromptCollection([
        { id: "legacy", body: "  보존할 프롬프트  ", tags: "분석, 분석" },
        { id: "empty", body: " " },
      ]);
      assert.equal(migrated.length, 1);
      assert.equal(migrated[0].title, "보존할 프롬프트");
      assert.deepEqual(migrated[0].tags, ["분석"]);
      assert.deepEqual(parseStoredPrompts("{bad-json"), []);
      assert.deepEqual(normalizePromptTags(null), []);
    },
  },
];
