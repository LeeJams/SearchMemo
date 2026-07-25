const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

function readTranslationKeys() {
  const source = fs.readFileSync(
    path.join(__dirname, "../locales/i18n.js"),
    "utf8"
  );
  const ast = parser.parse(source, { sourceType: "module" });
  const declaration = ast.program.body
    .find((node) => node.type === "VariableDeclaration")
    .declarations.find((item) => item.id.name === "translations");

  return Object.fromEntries(
    declaration.init.properties.map((language) => {
      const code = language.key.name || language.key.value;
      const keys = language.value.properties.map(
        (property) => property.key.name || property.key.value
      );
      return [code, keys];
    })
  );
}

module.exports = [
  {
    name: "all seven languages provide the same unique translation keys",
    test() {
      const translations = readTranslationKeys();
      assert.deepEqual(Object.keys(translations), [
        "en",
        "ko",
        "zh",
        "ja",
        "de",
        "ru",
        "hi",
      ]);

      const expectedKeys = [...new Set(translations.en)].sort();
      for (const [locale, keys] of Object.entries(translations)) {
        assert.equal(
          new Set(keys).size,
          keys.length,
          `${locale} contains duplicate translation keys`
        );
        assert.deepEqual(
          [...new Set(keys)].sort(),
          expectedKeys,
          `${locale} is missing translated UI strings`
        );
      }
    },
  },
];
