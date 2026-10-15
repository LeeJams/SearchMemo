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
    name: "AI services without prefill support copy the full memo without adding it to the URL",
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
    name: "AI prefill preserves multiline Korean emoji and reserved characters with a clipboard backup",
    test() {
      const text = "  한글 📝 &?#/+\n둘째 줄\t끝  ";
      const plan = buildSearchLaunchPlan({
        baseUrl: "https://chatgpt.com",
        appUrl: "https://chatgpt.com/#native",
        prefillUrl: "https://chatgpt.com/?prompt=",
        copyToClipboard: true,
      }, text, "ios");
      const url = new URL(plan.url);
      assert.equal(url.searchParams.get("prompt"), text);
      assert.equal(url.searchParams.has("q"), false);
      assert.equal(plan.clipboardText, text);
      assert.equal(plan.fallbackUrl, "https://chatgpt.com");
      assert.equal(plan.truncated, false);
    },
  },
  {
    name: "AI prefill respects the URL limit without ever sending a truncated memo",
    test() {
      const option = {
        baseUrl: "https://claude.ai",
        appUrl: "https://claude.ai/new",
        prefillUrl: "https://claude.ai/new?q=",
        copyToClipboard: true,
      };
      const atLimit = "a".repeat(MAX_SEARCH_URL_LENGTH - option.prefillUrl.length);
      const accepted = buildSearchLaunchPlan(option, atLimit, "ios");
      assert.equal(accepted.url.length, MAX_SEARCH_URL_LENGTH);
      assert.equal(new URL(accepted.url).searchParams.get("q"), atLimit);

      for (const text of [atLimit + "a", "긴 메모 🔎 & ".repeat(2000)]) {
        const plan = buildSearchLaunchPlan(option, text, "ios");
        assert.equal(plan.url, option.appUrl);
        assert.equal(plan.clipboardText, text);
        assert.equal(plan.truncated, false);
        assert.equal(new URL(plan.url).searchParams.has("q"), false);
      }
    },
  },
  {
    name: "unencodable AI text keeps the original app and clipboard flow",
    test() {
      const text = "memo\ud800";
      const plan = buildSearchLaunchPlan({
        baseUrl: "https://grok.com",
        appUrl: "https://grok.com/",
        prefillUrl: "https://grok.com/?q=",
        prefillSuffix: "&autoSubmit=false",
        copyToClipboard: true,
      }, text, "ios");
      assert.equal(plan.url, "https://grok.com/");
      assert.equal(plan.clipboardText, text);
    },
  },
  {
    name: "AI prefill opens after copying and falls back to the clean website on failure",
    async test() {
      const calls = [];
      const text = "질문을 보내지 않고 미리 입력 &autoSubmit=true\n#/+";
      const plan = buildSearchLaunchPlan({
        baseUrl: "https://grok.com",
        appUrl: "https://grok.com/",
        prefillUrl: "https://grok.com/?q=",
        prefillSuffix: "&autoSubmit=false",
        copyToClipboard: true,
      }, text, "android");
      assert.equal(new URL(plan.url).searchParams.get("autoSubmit"), "false");
      assert.equal(new URL(plan.url).searchParams.get("q"), text);
      await executeSearchLaunch(plan, {
        copyText: async (value) => calls.push(["copy", value]),
        openUrl: async (url) => {
          calls.push(["open", url]);
          if (url === plan.url) throw new Error("Prefill URL unavailable");
        },
      });
      assert.deepEqual(calls, [
        ["copy", text],
        ["open", plan.url],
        ["open", "https://grok.com"],
      ]);
    },
  },
  {
    name: "AI launch chooses an iOS app scheme or universal link without embedding the memo",
    test() {
      const option = {
        key: "gemini",
        baseUrl: "https://gemini.google.com",
        appUrl: "https://gemini.google.com/app",
        iosAppUrl: "googlegemini://",
        copyToClipboard: true,
      };
      const text = "전체 메모 🔎 & ".repeat(2000);
      const ios = buildSearchLaunchPlan(option, text, "ios");
      const android = buildSearchLaunchPlan(option, text, "android");
      assert.equal(ios.url, "googlegemini://");
      assert.equal(android.url, "https://gemini.google.com/app");
      for (const plan of [ios, android]) {
        assert.equal(plan.fallbackUrl, option.baseUrl);
        assert.equal(plan.clipboardText, text);
        assert.equal(plan.truncated, false);
      }
    },
  },
  {
    name: "an unavailable AI app falls back to the website after copying once",
    async test() {
      const calls = [];
      await executeSearchLaunch(
        {
          url: "googlegemini://",
          fallbackUrl: "https://gemini.google.com",
          clipboardText: "full memo",
        },
        {
          copyText: async (text) => calls.push(["copy", text]),
          openUrl: async (url) => {
            calls.push(["open", url]);
            if (url === "googlegemini://") throw new Error("App not installed");
          },
        }
      );
      assert.deepEqual(calls, [
        ["copy", "full memo"],
        ["open", "googlegemini://"],
        ["open", "https://gemini.google.com"],
      ]);
    },
  },
  {
    name: "an installed AI app opens without also opening the browser",
    async test() {
      const opened = [];
      await executeSearchLaunch(
        {
          url: "https://chatgpt.com/#native",
          fallbackUrl: "https://chatgpt.com",
          clipboardText: "memo",
        },
        {
          copyText: async () => {},
          openUrl: async (url) => opened.push(url),
        }
      );
      assert.deepEqual(opened, ["https://chatgpt.com/#native"]);
    },
  },
  {
    name: "failed clipboard or browser operations surface an error instead of reporting success",
    async test() {
      const plan = {
        url: "googlegemini://",
        fallbackUrl: "https://gemini.google.com",
        clipboardText: "memo",
      };
      const opened = [];
      await assert.rejects(
        executeSearchLaunch(plan, {
          copyText: async () => { throw new Error("Clipboard unavailable"); },
          openUrl: async (url) => opened.push(url),
        }),
        /Clipboard unavailable/
      );
      assert.deepEqual(opened, []);
      await assert.rejects(
        executeSearchLaunch(plan, {
          copyText: async () => {},
          openUrl: async () => { throw new Error("Cannot open URL"); },
        }),
        /Cannot open URL/
      );
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
