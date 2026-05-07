const path = require("node:path");

const testFiles = [
  "../__tests__/memoModel.test.js",
  "../__tests__/optionModel.test.js",
];

let failures = 0;
let total = 0;

for (const file of testFiles) {
  const tests = require(path.join(__dirname, file));
  for (const { name, test } of tests) {
    total += 1;
    try {
      test();
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
  process.exit(1);
}

console.log(`${total} tests passed.`);
