const path = require("node:path");

const testFiles = [
  "../__tests__/memoModel.test.js",
  "../__tests__/memoDetailFlow.test.js",
  "../__tests__/memoActionLayout.test.js",
  "../__tests__/searchActionModel.test.js",
  "../__tests__/memoEditorModel.test.js",
  "../__tests__/folderModel.test.js",
  "../__tests__/optionModel.test.js",
  "../__tests__/promptModel.test.js",
  "../__tests__/backupModel.test.js",
  "../__tests__/translations.test.js",
];

async function run() {
  let failures = 0;
  let total = 0;

  for (const file of testFiles) {
    const tests = require(path.join(__dirname, file));
    for (const { name, test } of tests) {
      total += 1;
      try {
        await test();
        console.log(`✓ ${name}`);
      } catch (error) {
        failures += 1;
        console.error(`✗ ${name}`);
        console.error(error);
      }
    }
  }

  if (failures > 0) {
    console.error(`${failures}/${total} tests failed.`);
    process.exitCode = 1;
    return;
  }

  console.log(`${total} tests passed.`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
