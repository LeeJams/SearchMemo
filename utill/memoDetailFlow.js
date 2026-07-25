const INITIAL_MEMO_DETAIL_FLOW = Object.freeze({
  editorVisible: false,
  detailVisible: false,
});

function memoDetailFlowReducer(state = INITIAL_MEMO_DETAIL_FLOW, action = {}) {
  switch (action.type) {
    case "openDetail":
      return {
        editorVisible: false,
        detailVisible: true,
      };
    case "closeDetail":
      return INITIAL_MEMO_DETAIL_FLOW;
    case "openEditor":
      return {
        editorVisible: true,
        detailVisible: false,
      };
    case "closeEditor":
    case "closeAll":
      return INITIAL_MEMO_DETAIL_FLOW;
    default:
      return state;
  }
}

function memoActionSheetReducer(visible = false, action = {}) {
  switch (action.type) {
    case "open":
      return true;
    case "close":
      return false;
    default:
      return visible;
  }
}

module.exports = {
  INITIAL_MEMO_DETAIL_FLOW,
  memoDetailFlowReducer,
  memoActionSheetReducer,
};
