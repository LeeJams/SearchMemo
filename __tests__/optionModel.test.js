const assert = require("node:assert/strict");
const path = require("node:path");
const babel = require("@babel/core");
const {
  SEARCH_OPTIONS_VERSION,
  defaultSelectedSearchOptions,
  migrateSelectedSearchOptions,
  sanitizeSelectedSearchOptions,
} = require("../utill/optionModel");
const { buildSearchLaunchPlan } = require("../utill/searchActionModel");

function loadOptionServices(selectedKeys) {
  const storage = new Map(selectedKeys ? [
    ["selectedSearchOptions", JSON.stringify(selectedKeys)],
    ["selectedSearchOptionsVersion", SEARCH_OPTIONS_VERSION],
  ] : []);
  const asyncStorage = {
    multiGet: async (keys) => keys.map((key) => [key, storage.get(key) ?? null]),
    multiSet: async (entries) => entries.forEach(([key, value]) => storage.set(key, value)),
  };
  const { code } = babel.transformFileSync(path.join(__dirname, "../utill/option.js"), {
    configFile: false,
    babelrc: false,
    plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")],
  });
  const loaded = { exports: {} };
  new Function("require", "module", "exports", code)((name) => {
    if (name === "@react-native-async-storage/async-storage") return asyncStorage;
    if (name === "./optionModel") return require("../utill/optionModel");
    throw new Error(`Unexpected dependency: ${name}`);
  }, loaded, loaded.exports);
  return { services: loaded.exports, storage };
}

module.exports = [
  {
    name: "sanitizeSelectedSearchOptions removes unknown keys and keeps at least one default",
    test() {
      assert.deepEqual(sanitizeSelectedSearchOptions(["google", "unknown", "google"]), ["google"]);
      const expectedDefaults = ["chatgpt", "claude", "gemini", "grok", "google", "youtube", "bing"];
      assert.deepEqual(defaultSelectedSearchOptions, expectedDefaults);
      assert.deepEqual(sanitizeSelectedSearchOptions([]), expectedDefaults);
      assert.deepEqual(sanitizeSelectedSearchOptions("bad"), expectedDefaults);
    },
  },
  {
    name: "sanitizeSelectedSearchOptions preserves intentional user deselection of default options",
    test() {
      assert.deepEqual(sanitizeSelectedSearchOptions(["youtube", "google"]), ["youtube", "google"]);
    },
  },
  {
    name: "legacy default preferences migrate once to include all four primary AI services",
    test() {
      const legacyDefaults = ["google", "youtube", "bing", "chatgpt", "gemini", "perplexity"];
      assert.deepEqual(
        migrateSelectedSearchOptions(legacyDefaults, null),
        defaultSelectedSearchOptions
      );
      assert.deepEqual(
        migrateSelectedSearchOptions(legacyDefaults, SEARCH_OPTIONS_VERSION),
        legacyDefaults
      );
      assert.deepEqual(
        migrateSelectedSearchOptions(["google", "claude"], null),
        ["google", "claude"]
      );
      const previousDefaults = [...defaultSelectedSearchOptions, "perplexity"];
      assert.deepEqual(
        migrateSelectedSearchOptions(previousDefaults, "2"),
        defaultSelectedSearchOptions
      );
      assert.deepEqual(
        migrateSelectedSearchOptions(previousDefaults, SEARCH_OPTIONS_VERSION),
        previousDefaults
      );
      assert.deepEqual(
        migrateSelectedSearchOptions(["perplexity", "deepseek", "google"], "2"),
        ["perplexity", "deepseek", "google"]
      );
    },
  },
  {
    name: "fresh preferences select exactly four AI services and keep search services separate",
    async test() {
      const { services, storage } = loadOptionServices();
      assert.deepEqual((await services.getSelectedAIOptions()).map((option) => option.key), [
        "chatgpt", "claude", "gemini", "grok",
      ]);
      assert.deepEqual(
        (await services.getActionOptions()).map((option) => option.key),
        ["google", "youtube", "bing"]
      );
      assert.deepEqual(
        JSON.parse(storage.get("selectedSearchOptions")),
        defaultSelectedSearchOptions
      );
    },
  },
  {
    name: "all selected AI services appear in detail and none appear in search",
    async test() {
      const selected = ["deepseek", "google", "claude", "copilot", "scholar", "perplexity", "grok"];
      const { services } = loadOptionServices(selected);
      const aiOptions = await services.getSelectedAIOptions();
      const searchOptions = await services.getActionOptions();
      assert.deepEqual(aiOptions.map((option) => option.key), [
        "deepseek", "claude", "copilot", "perplexity", "grok",
      ]);
      assert.deepEqual(searchOptions.map((option) => option.key), ["google", "scholar"]);
      assert.ok(aiOptions.every((option) => option.region === "ai"));
      assert.ok(searchOptions.every((option) => option.region !== "ai"));
      assert.deepEqual(await services.getSelectedSearchOptions(), selected);
    },
  },
  {
    name: "only verified AI providers prefill drafts while retaining native app fallbacks",
    test() {
      const { services } = loadOptionServices();
      const text = "메모 원문\n한글 📝 &?#/+";
      const providers = { chatgpt: "prompt", claude: "q", grok: "q" };
      for (const [key, parameter] of Object.entries(providers)) {
        const option = services.allSearchOptions.find((item) => item.key === key);
        for (const platform of ["ios", "android"]) {
          const plan = buildSearchLaunchPlan(option, text, platform);
          const url = new URL(plan.url);
          assert.equal(url.searchParams.get(parameter), text);
          assert.equal(plan.clipboardText, text);
          assert.equal(plan.fallbackUrl, option.baseUrl);
          if (key === "chatgpt") assert.equal(url.searchParams.has("q"), false);
          if (key === "grok") assert.equal(url.searchParams.get("autoSubmit"), "false");
        }
      }
      for (const key of ["gemini", "perplexity", "copilot", "deepseek"]) {
        const option = services.allSearchOptions.find((item) => item.key === key);
        assert.equal(option.prefillUrl, undefined);
        const plan = buildSearchLaunchPlan(option, text, "ios");
        assert.equal(plan.url, option.iosAppUrl || option.appUrl || option.baseUrl);
        assert.equal(plan.clipboardText, text);
      }
    },
  },
  {
    name: "AI-only and search-only preferences keep the other service area empty",
    async test() {
      const { services } = loadOptionServices(["chatgpt", "deepseek"]);
      assert.deepEqual(await services.getActionOptions(), []);
      assert.deepEqual(
        (await services.getSelectedAIOptions()).map((option) => option.key),
        ["chatgpt", "deepseek"]
      );
      await services.saveSelectedSearchOptions(["google"]);
      assert.deepEqual(await services.getSelectedAIOptions(), []);
      assert.deepEqual(
        (await services.getActionOptions()).map((option) => option.key),
        ["google"]
      );
    },
  },
];
