const assert = require("node:assert/strict");
const {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  serializeBackup,
  parseBackup,
  mergeBackupData,
} = require("../utill/backupModel");

const fixedNow = () => new Date("2026-07-23T12:00:00.000Z");
const memo = {
  schemaVersion: 2,
  id: "memo-1",
  text: "메모",
  color: "#e6e6e6",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  date: "2026. 01. 01.",
  favorite: false,
  tags: [],
};
const prompt = {
  schemaVersion: 1,
  id: "prompt-1",
  title: "프롬프트",
  body: "프롬프트 본문",
  tags: ["업무"],
  favorite: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  lastUsedAt: null,
};

module.exports = [
  {
    name: "backup serialization round-trips memos and prompts",
    test() {
      const serialized = serializeBackup(
        { memos: [memo], prompts: [prompt] },
        fixedNow
      );
      const parsed = parseBackup(serialized, { now: fixedNow });
      assert.equal(parsed.format, BACKUP_FORMAT);
      assert.equal(parsed.version, BACKUP_VERSION);
      assert.equal(parsed.memos[0].id, "memo-1");
      assert.equal(parsed.prompts[0].id, "prompt-1");
    },
  },
  {
    name: "backup parser rejects malformed files without returning partial data",
    test() {
      assert.throws(() => parseBackup("{bad"), /invalid-json/);
      assert.throws(
        () =>
          parseBackup({
            format: BACKUP_FORMAT,
            version: BACKUP_VERSION,
            exportedAt: "2026-07-23T12:00:00.000Z",
            memos: [memo],
            prompts: [{ id: "bad", body: " " }],
          }),
        /invalid-items/
      );
      assert.throws(
        () =>
          parseBackup({
            format: BACKUP_FORMAT,
            version: BACKUP_VERSION,
            exportedAt: "2026-07-23T12:00:00.000Z",
            memos: [{ ...memo, updatedAt: "not-a-date" }],
            prompts: [prompt],
          }),
        /invalid-items/
      );
    },
  },
  {
    name: "backup merge keeps the newest duplicate and adds new ids",
    test() {
      const importedPrompt = {
        ...prompt,
        body: "새 본문",
        updatedAt: "2026-07-01T00:00:00.000Z",
      };
      const newMemo = { ...memo, id: "memo-2", text: "새 메모" };
      const merged = mergeBackupData(
        { memos: [memo], prompts: [prompt] },
        { memos: [newMemo], prompts: [importedPrompt] }
      );
      assert.equal(merged.memos.length, 2);
      assert.equal(merged.prompts.length, 1);
      assert.equal(merged.prompts[0].body, "새 본문");
    },
  },
];
