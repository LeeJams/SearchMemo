const assert = require("node:assert/strict");

const { buildActionGridRows } = require("../utill/memoActionLayout");

module.exports = [
  {
    name: "action grid builds equal three-column rows with stable placeholders",
    test: () => {
      const options = ["google", "youtube", "bing", "chatgpt", "gemini"];
      const rows = buildActionGridRows(options);

      assert.deepEqual(rows, [
        ["google", "youtube", "bing"],
        ["chatgpt", "gemini", null],
      ]);
      assert.ok(rows.every((row) => row.length === 3));
    },
  },
  {
    name: "action grid safely handles invalid and custom column input",
    test: () => {
      assert.deepEqual(buildActionGridRows(null), []);
      assert.deepEqual(buildActionGridRows([1, 2, 3], 2), [
        [1, 2],
        [3, null],
      ]);
    },
  },
];
