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
  schemaVersion: 3,
  id: "memo-1",
  text: "메모",
  color: "#e6e6e6",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  date: "2026. 01. 01.",
  favorite: false,
  tags: [],
  folderId: "folder-1",
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
const folder = {
  schemaVersion: 1,
  id: "folder-1",
  name: "업무",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

module.exports = [
  {
    name: "backup v2 serialization round-trips memos prompts and folders",
    test() {
      const serialized = serializeBackup(
        { memos: [memo], prompts: [prompt], folders: [folder] },
        fixedNow
      );
      const parsed = parseBackup(serialized, { now: fixedNow });
      assert.equal(parsed.format, BACKUP_FORMAT);
      assert.equal(parsed.version, BACKUP_VERSION);
      assert.equal(parsed.memos[0].id, "memo-1");
      assert.equal(parsed.prompts[0].id, "prompt-1");
      assert.equal(parsed.folders[0].id, "folder-1");
    },
  },
  {
    name: "backup parser remains compatible with version 1 files",
    test() {
      const parsed = parseBackup({
        format: BACKUP_FORMAT,
        version: 1,
        exportedAt: "2026-07-23T12:00:00.000Z",
        memos: [{ ...memo, schemaVersion: 2, folderId: undefined }],
        prompts: [prompt],
      });
      assert.equal(parsed.version, 1);
      assert.deepEqual(parsed.folders, []);
      assert.equal(parsed.memos[0].folderId, null);
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
            folders: [folder],
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
            folders: [folder],
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
        { memos: [memo], prompts: [prompt], folders: [folder] },
        {
          memos: [newMemo],
          prompts: [importedPrompt],
          folders: [{ ...folder, name: "새 업무", updatedAt: "2026-07-01T00:00:00.000Z" }],
        }
      );
      assert.equal(merged.memos.length, 2);
      assert.equal(merged.prompts.length, 1);
      assert.equal(merged.prompts[0].body, "새 본문");
      assert.equal(merged.folders[0].name, "새 업무");
    },
  },
];
