const assert = require("node:assert/strict");
const {
  FOLDER_SCHEMA_VERSION,
  createFolder,
  renameFolder,
  migrateFolderCollection,
  isFolderNameAvailable,
} = require("../utill/folderModel");

const fixedNow = () => new Date("2026-07-24T01:00:00.000Z");

module.exports = [
  {
    name: "folder creation trims names and writes stable schema fields",
    test() {
      const folder = createFolder(
        { name: "  업무 자료  " },
        { now: fixedNow, idFactory: () => "folder-1" }
      );
      assert.deepEqual(folder, {
        schemaVersion: FOLDER_SCHEMA_VERSION,
        id: "folder-1",
        name: "업무 자료",
        createdAt: "2026-07-24T01:00:00.000Z",
        updatedAt: "2026-07-24T01:00:00.000Z",
      });
    },
  },
  {
    name: "folder rename preserves creation date and rejects blank names",
    test() {
      const folder = createFolder(
        { name: "업무" },
        {
          now: () => new Date("2026-01-01T00:00:00.000Z"),
          idFactory: () => "folder-2",
        }
      );
      const renamed = renameFolder(folder, " 프로젝트 ", { now: fixedNow });
      assert.equal(renamed.name, "프로젝트");
      assert.equal(renamed.createdAt, "2026-01-01T00:00:00.000Z");
      assert.equal(renamed.updatedAt, "2026-07-24T01:00:00.000Z");
      assert.throws(() => renameFolder(folder, "  ", { now: fixedNow }), /folder-name-required/);
    },
  },
  {
    name: "folder names are unique ignoring case and invalid saved folders are dropped",
    test() {
      const folders = migrateFolderCollection([
        {
          schemaVersion: 1,
          id: "one",
          name: "Work",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          schemaVersion: 1,
          id: "two",
          name: " work ",
          createdAt: "2026-01-02T00:00:00.000Z",
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
        { id: "bad", name: " " },
      ]);
      assert.equal(folders.length, 1);
      assert.equal(folders[0].name, "Work");
      assert.equal(isFolderNameAvailable(folders, "WORK"), false);
      assert.equal(isFolderNameAvailable(folders, "Personal"), true);
    },
  },
];
