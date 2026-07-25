const assert = require("node:assert/strict");
const {
  createMemo,
  updateMemo,
  migrateMemoCollection,
  parseStoredMemos,
  MEMO_SCHEMA_VERSION,
  MEMO_MAX_LENGTH,
  PROMPTS_FOLDER_ID,
  getMemoTitle,
  getMemoPreview,
  getMemoListContent,
  MEMO_LIST_MAX_LINES,
  filterMemos,
  mergePromptsIntoMemos,
} = require("../utill/memoModel");

const fixedNow = () => new Date("2026-05-07T07:00:00.000Z");

module.exports = [
  {
    name: "createMemo stores trimmed text with stable schema timestamps and uuid id",
    test() {
      const memo = createMemo({ text: "  expo upgrade  ", color: "#fa5252" }, { now: fixedNow, idFactory: () => "memo-1" });
      assert.equal(memo.schemaVersion, MEMO_SCHEMA_VERSION);
      assert.equal(memo.id, "memo-1");
      assert.equal(memo.text, "expo upgrade");
      assert.equal(memo.color, "#fa5252");
      assert.equal(memo.createdAt, "2026-05-07T07:00:00.000Z");
      assert.equal(memo.updatedAt, "2026-05-07T07:00:00.000Z");
      assert.equal(memo.favorite, false);
      assert.deepEqual(memo.tags, []);
      assert.equal(memo.folderId, null);
    },
  },
  {
    name: "updateMemo preserves createdAt and refreshes updatedAt",
    test() {
      const original = createMemo({ text: "old", color: "#e6e6e6" }, { now: () => new Date("2026-01-01T00:00:00.000Z"), idFactory: () => "memo-2" });
      const updated = updateMemo(original, { text: "  new  ", color: "#52c2fa" }, { now: fixedNow });
      assert.equal(updated.createdAt, "2026-01-01T00:00:00.000Z");
      assert.equal(updated.updatedAt, "2026-05-07T07:00:00.000Z");
      assert.equal(updated.text, "new");
      assert.equal(updated.color, "#52c2fa");
    },
  },
  {
    name: "memo model supports 20,000 characters and folder assignment",
    test() {
      assert.equal(MEMO_MAX_LENGTH, 20000);
      const memo = createMemo(
        { text: "a".repeat(MEMO_MAX_LENGTH + 10), folderId: "work" },
        { now: fixedNow, idFactory: () => "memo-long" }
      );
      assert.equal(memo.text.length, MEMO_MAX_LENGTH);
      assert.equal(memo.folderId, "work");

      const moved = updateMemo(memo, { text: memo.text, folderId: null }, { now: fixedNow });
      assert.equal(moved.folderId, null);
    },
  },
  {
    name: "memo presentation uses the first line as title and hides it from preview",
    test() {
      const text = "여행 준비\n여권 챙기기\n숙소 주소 확인";
      assert.equal(getMemoTitle(text), "여행 준비");
      assert.equal(getMemoPreview(text), "여권 챙기기\n숙소 주소 확인");
      assert.equal(getMemoPreview("한 줄 메모"), "");
    },
  },
  {
    name: "memo list keeps one-line content intact for a three-line card preview",
    test() {
      const oneLine = "a".repeat(180);
      assert.equal(MEMO_LIST_MAX_LINES, 3);
      assert.equal(getMemoListContent(oneLine), oneLine);
      assert.equal(
        getMemoListContent("회의 제목\n첫 번째 내용\n두 번째 내용"),
        "회의 제목\n첫 번째 내용\n두 번째 내용"
      );
    },
  },
  {
    name: "memo filtering combines folder and Korean or English partial search",
    test() {
      const memos = [
        { id: "1", text: "회의 정리", folderId: "work" },
        { id: "2", text: "Travel plan", folderId: "personal" },
        { id: "3", text: "업무 아이디어", folderId: null },
      ];
      assert.deepEqual(
        filterMemos(memos, { query: "회의", folderId: "work" }).map((memo) => memo.id),
        ["1"]
      );
      assert.deepEqual(
        filterMemos(memos, { query: "travel", folderId: "all" }).map((memo) => memo.id),
        ["2"]
      );
      assert.deepEqual(
        filterMemos(memos, { folderId: null }).map((memo) => memo.id),
        ["3"]
      );
    },
  },
  {
    name: "legacy prompts migrate into one folder without creating duplicates",
    test() {
      const prompt = {
        id: "prompt-1",
        title: "요약 도우미",
        body: "다음 글을 세 줄로 요약해줘.",
        tags: ["업무"],
        favorite: true,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };
      const first = mergePromptsIntoMemos([], [prompt], { now: fixedNow });
      assert.equal(first.length, 1);
      assert.equal(first[0].id, "prompt:prompt-1");
      assert.equal(first[0].folderId, PROMPTS_FOLDER_ID);
      assert.equal(first[0].text, "요약 도우미\n\n다음 글을 세 줄로 요약해줘.");
      assert.deepEqual(first[0].tags, ["업무"]);
      assert.equal(first[0].favorite, true);

      const second = mergePromptsIntoMemos(first, [prompt], { now: fixedNow });
      assert.equal(second.length, 1);
    },
  },
  {
    name: "migrateMemoCollection migrates legacy date-only memos without data loss",
    test() {
      const migrated = migrateMemoCollection([
        { id: 123, text: " legacy ", date: "2025. 02. 03.", color: "#8452fa" },
      ], { now: fixedNow });
      assert.equal(migrated.length, 1);
      assert.equal(migrated[0].id, "123");
      assert.equal(migrated[0].text, "legacy");
      const expectedLocalMidnight = new Date(2025, 1, 3).toISOString();
      assert.equal(migrated[0].createdAt, expectedLocalMidnight);
      assert.equal(migrated[0].updatedAt, expectedLocalMidnight);
      assert.equal(migrated[0].schemaVersion, MEMO_SCHEMA_VERSION);
      assert.equal(migrated[0].folderId, null);
    },
  },
  {
    name: "parseStoredMemos safely returns fallback on invalid json",
    test() {
      assert.deepEqual(parseStoredMemos("{not-json", { now: fixedNow }), []);
      assert.deepEqual(parseStoredMemos(null, { now: fixedNow }), []);
    },
  },
];
