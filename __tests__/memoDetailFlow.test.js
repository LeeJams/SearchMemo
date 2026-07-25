const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  MEMO_HOME_ROUTE,
  MEMO_DETAIL_ROUTE,
  INITIAL_MEMO_DETAIL_FLOW,
  memoDetailFlowReducer,
  memoActionSheetReducer,
  buildMemoDetailRoute,
} = require("../utill/memoDetailFlow");

const readSource = (relativePath) =>
  fs.readFileSync(path.join(__dirname, relativePath), "utf8");

module.exports = [
  {
    name: "opening a memo builds a detail route instead of a modal flag",
    test: () => {
      assert.equal(MEMO_HOME_ROUTE, "MemoHome");
      assert.equal(MEMO_DETAIL_ROUTE, "MemoDetail");
      assert.deepEqual(buildMemoDetailRoute({ id: "memo-1" }), [
        "MemoDetail",
        { memoId: "memo-1" },
      ]);
      assert.equal(buildMemoDetailRoute(null), null);
      assert.equal(buildMemoDetailRoute({}), null);
      assert.equal("detailVisible" in INITIAL_MEMO_DETAIL_FLOW, false);
    },
  },
  {
    name: "the editor overlays any screen and remembers its target memo",
    test: () => {
      const editingState = memoDetailFlowReducer(INITIAL_MEMO_DETAIL_FLOW, {
        type: "openEditor",
        memoId: "memo-1",
      });
      assert.deepEqual(editingState, {
        editorVisible: true,
        editingMemoId: "memo-1",
        editorFolderId: null,
      });

      assert.deepEqual(
        memoDetailFlowReducer(INITIAL_MEMO_DETAIL_FLOW, {
          type: "openEditor",
          folderId: "folder-1",
        }),
        {
          editorVisible: true,
          editingMemoId: null,
          editorFolderId: "folder-1",
        }
      );

      assert.deepEqual(
        memoDetailFlowReducer(editingState, { type: "closeEditor" }),
        INITIAL_MEMO_DETAIL_FLOW
      );
      assert.deepEqual(
        memoDetailFlowReducer(editingState, { type: "closeAll" }),
        INITIAL_MEMO_DETAIL_FLOW
      );
    },
  },
  {
    name: "search actions stay layered over the open memo detail page",
    test: () => {
      assert.equal(memoActionSheetReducer(false, { type: "open" }), true);
      assert.equal(memoActionSheetReducer(true, { type: "close" }), false);

      const detailSource = readSource("../components/memo/MemoDetailScreen.js");
      assert.match(detailSource, /<MemoActionModal/);
      assert.doesNotMatch(
        readSource("../components/memo/MemoHomeScreen.js"),
        /<MemoActionModal/
      );
    },
  },
  {
    name: "memo detail is a swipe-dismissable stack screen, not a modal",
    test: () => {
      const detailSource = readSource("../components/memo/MemoDetailScreen.js");
      const navigatorSource = readSource(
        "../components/navigation/RootNavigator.js"
      );
      const homeSource = readSource("../components/memo/MemoHomeScreen.js");

      assert.doesNotMatch(detailSource, /<Modal\b/);
      assert.match(detailSource, /navigation\.goBack\(\)/);
      assert.match(navigatorSource, /createNativeStackNavigator/);
      assert.match(navigatorSource, /gestureEnabled: true/);
      assert.match(navigatorSource, /fullScreenGestureEnabled: true/);
      assert.match(navigatorSource, /name=\{MEMO_DETAIL_ROUTE\}/);
      assert.match(homeSource, /navigation\.navigate\(\.\.\.route\)/);

      assert.equal(
        fs.existsSync(
          path.join(__dirname, "../components/modal/MemoDetailModal.js")
        ),
        false
      );
    },
  },
  {
    name: "detail renders four direct actions in the requested order",
    test: () => {
      const detailSource = readSource("../components/memo/MemoDetailScreen.js");
      const optionSource = readSource("../utill/option.js");

      const deleteIndex = detailSource.indexOf('icon="trash-2"');
      const modifyIndex = detailSource.indexOf('icon="edit-2"');
      const copyIndex = detailSource.indexOf(
        'icon={copied ? "check" : "copy"}'
      );
      const searchIndex = detailSource.indexOf('icon="search"');

      assert.ok(deleteIndex > -1);
      assert.ok(deleteIndex < modifyIndex);
      assert.ok(modifyIndex < copyIndex);
      assert.ok(copyIndex < searchIndex);

      const headerSource = detailSource.slice(
        detailSource.indexOf("<View style={[styles.header"),
        detailSource.indexOf("<ScrollView")
      );
      assert.doesNotMatch(headerSource, /openEditor/);
      assert.match(detailSource, /label=\{i18n\.t\("searchAction"\)\}/);
      assert.match(detailSource, /destructive/);

      assert.doesNotMatch(optionSource, /getFixedActionOptions/);
    },
  },
  {
    name: "nested search sheet contains search services only",
    test: () => {
      const actionSource = readSource("../components/modal/MemoActionModal.js");

      assert.match(actionSource, /styles\.sheetHeader/);
      assert.match(actionSource, /i18n\.t\("searchServices"\)/);
      assert.match(actionSource, /name="search"/);
      assert.doesNotMatch(actionSource, /case "copy"/);
      assert.doesNotMatch(actionSource, /modifyMemo/);
      assert.doesNotMatch(actionSource, /deleteMemo/);
      assert.doesNotMatch(actionSource, /fixedActionsSection/);
      assert.doesNotMatch(actionSource, /memoActions/);
    },
  },
];
