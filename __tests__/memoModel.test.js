const assert = require("node:assert/strict");
const {
  createMemo,
  updateMemo,
  migrateMemoCollection,
  parseStoredMemos,
  MEMO_SCHEMA_VERSION,
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
    name: "migrateMemoCollection migrates legacy date-only memos without data loss",
    test() {
      const migrated = migrateMemoCollection([
        { id: 123, text: " legacy ", date: "2025. 02. 03.", color: "#8452fa" },
      ], { now: fixedNow });
      assert.equal(migrated.length, 1);
      assert.equal(migrated[0].id, "123");
      assert.equal(migrated[0].text, "legacy");
      assert.equal(migrated[0].createdAt, "2025-02-03T00:00:00.000Z");
      assert.equal(migrated[0].updatedAt, "2025-02-03T00:00:00.000Z");
      assert.equal(migrated[0].schemaVersion, MEMO_SCHEMA_VERSION);
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
