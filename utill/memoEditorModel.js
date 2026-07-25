const FALLBACK_MEMO_COLOR = "#e6e6e6";

function normalizeMemoColor(color) {
  return typeof color === "string" && color.trim()
    ? color.trim()
    : FALLBACK_MEMO_COLOR;
}

function createMemoColorPaletteState(color) {
  return {
    selectedColor: normalizeMemoColor(color),
    visible: false,
  };
}

function memoColorPaletteReducer(state, action = {}) {
  switch (action.type) {
    case "toggle":
      return {
        ...state,
        visible: !state.visible,
      };
    case "close":
      return {
        ...state,
        visible: false,
      };
    case "select":
      return {
        selectedColor: normalizeMemoColor(action.color),
        visible: false,
      };
    case "reset":
      return createMemoColorPaletteState(action.color);
    default:
      return state;
  }
}

module.exports = {
  FALLBACK_MEMO_COLOR,
  createMemoColorPaletteState,
  memoColorPaletteReducer,
};
