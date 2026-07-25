const MEMO_HOME_ROUTE = "MemoHome";
const MEMO_DETAIL_ROUTE = "MemoDetail";

const INITIAL_MEMO_DETAIL_FLOW = Object.freeze({
  editorVisible: false,
  editingMemoId: null,
  editorFolderId: null,
});

function memoDetailFlowReducer(state = INITIAL_MEMO_DETAIL_FLOW, action = {}) {
  switch (action.type) {
    case "openEditor":
      return {
        editorVisible: true,
        editingMemoId: action.memoId || null,
        editorFolderId: action.folderId || null,
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

function buildMemoDetailRoute(memo) {
  if (!memo || !memo.id) return null;
  return [MEMO_DETAIL_ROUTE, { memoId: memo.id }];
}

module.exports = {
  MEMO_HOME_ROUTE,
  MEMO_DETAIL_ROUTE,
  INITIAL_MEMO_DETAIL_FLOW,
  memoDetailFlowReducer,
  memoActionSheetReducer,
  buildMemoDetailRoute,
};
