const assert = require("node:assert/strict");
const {
  sanitizeSelectedSearchOptions,
} = require("../utill/optionModel");

module.exports = [
  {
    name: "sanitizeSelectedSearchOptions removes unknown keys and keeps at least one default",
    test() {
      assert.deepEqual(sanitizeSelectedSearchOptions(["google", "unknown", "google"]), ["google"]);
      assert.deepEqual(sanitizeSelectedSearchOptions([]), ["google", "youtube", "bing", "chatgpt", "gemini", "perplexity"]);
      assert.deepEqual(sanitizeSelectedSearchOptions("bad"), ["google", "youtube", "bing", "chatgpt", "gemini", "perplexity"]);
    },
  },
  {
    name: "sanitizeSelectedSearchOptions preserves intentional user deselection of default options",
    test() {
      assert.deepEqual(sanitizeSelectedSearchOptions(["youtube", "google"]), ["youtube", "google"]);
    },
  },
];
