const assert = require("node:assert/strict");

const {
  createMemoColorPaletteState,
  memoColorPaletteReducer,
} = require("../utill/memoEditorModel");

module.exports = [
  {
    name: "memo color palette toggles without changing the selected color",
    test: () => {
      const initial = createMemoColorPaletteState("#e6e6e6");
      const opened = memoColorPaletteReducer(initial, { type: "toggle" });

      assert.deepEqual(opened, {
        selectedColor: "#e6e6e6",
        visible: true,
      });
      assert.deepEqual(memoColorPaletteReducer(opened, { type: "toggle" }), initial);
    },
  },
  {
    name: "memo color selection applies the color and closes the palette",
    test: () => {
      const opened = {
        selectedColor: "#e6e6e6",
        visible: true,
      };

      assert.deepEqual(
        memoColorPaletteReducer(opened, {
          type: "select",
          color: "#52c2fa",
        }),
        {
          selectedColor: "#52c2fa",
          visible: false,
        }
      );
      assert.deepEqual(
        memoColorPaletteReducer(opened, {
          type: "reset",
          color: "#fa5252",
        }),
        {
          selectedColor: "#fa5252",
          visible: false,
        }
      );
    },
  },
];
