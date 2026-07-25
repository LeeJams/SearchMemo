const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  MAX_SEARCH_URL_LENGTH,
  buildSearchLaunchPlan,
  executeSearchLaunch,
} = require("../utill/searchActionModel");

module.exports = [
  {
    name: "web search encodes Korean and reserved characters",
    test() {
      const plan = buildSearchLaunchPlan(
        {
          key: "google",
          baseUrl: "https://www.google.com/search?q=",
        },
        "한글 &?#/+"
      );

      assert.equal(
        plan.url,
        "https://www.google.com/search?q=" +
          "%ED%95%9C%EA%B8%80%20%26%3F%23%2F%2B"
      );
      assert.equal(plan.clipboardText, null);
      assert.equal(plan.truncated, false);
    },
  },
  {
    name: "web search keeps a 20,000 character memo inside the URL budget",
    test() {
      const plan = buildSearchLaunchPlan(
        {
          key: "scholar",
          baseUrl: "https://scholar.google.com/scholar?q=",
        },
        "긴 메모 🔎 & ".repeat(2500)
      );

      assert.ok(plan.url.length <= MAX_SEARCH_URL_LENGTH);
      assert.equal(plan.clipboardText, null);
      assert.equal(plan.truncated, true);
      assert.doesNotMatch(plan.url, /%EF%BF%BD/);
    },
  },
  {
    name: "AI launch copies the full memo and never appends it to the URL",
    test() {
      const memo = "전체 프롬프트 ".repeat(2000);
      const plan = buildSearchLaunchPlan(
        {
          key: "copilot",
          baseUrl: "https://copilot.com",
          copyToClipboard: true,
        },
        memo
      );

      assert.equal(plan.url, "https://copilot.com");
      assert.equal(plan.clipboardText, memo);
      assert.equal(plan.truncated, false);
    },
  },
  {
    name: "launch execution copies before opening an AI service",
    async test() {
      const calls = [];
      await executeSearchLaunch(
        {
          url: "https://chat.deepseek.com",
          clipboardText: "prompt",
          truncated: false,
        },
        {
          copyText: async (text) => calls.push(["copy", text]),
          openUrl: async (url) => calls.push(["open", url]),
        }
      );

      assert.deepEqual(calls, [
        ["copy", "prompt"],
        ["open", "https://chat.deepseek.com"],
      ]);
    },
  },
  {
    name: "search catalog includes audited services and matching icons",
    test() {
      const optionSource = fs.readFileSync(
        path.join(__dirname, "../utill/option.js"),
        "utf8"
      );
      const iconSource = fs.readFileSync(
        path.join(__dirname, "../components/icons/SearchIcons.js"),
        "utf8"
      );
      const expectedKeys = [
        "brave",
        "scholar",
        "semanticScholar",
        "copilot",
        "deepseek",
      ];

      for (const key of expectedKeys) {
        assert.match(optionSource, new RegExp(`key: "${key}"`));
        assert.match(iconSource, new RegExp(`\\b${key}:`));
      }
      assert.match(optionSource, /label: "YouTube"/);
      assert.match(optionSource, /baseUrl: "https:\/\/chatgpt\.com"/);
      assert.match(optionSource, /baseUrl: "https:\/\/grok\.com"/);
    },
  },
];
