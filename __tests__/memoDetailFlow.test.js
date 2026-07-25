const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  INITIAL_MEMO_DETAIL_FLOW,
  memoDetailFlowReducer,
  memoActionSheetReducer,
} = require("../utill/memoDetailFlow");

module.exports = [
  {
    name: "search and actions stay layered over the open memo detail",
    test: () => {
      const detailState = memoDetailFlowReducer(INITIAL_MEMO_DETAIL_FLOW, {
        type: "openDetail",
      });
      assert.deepEqual(detailState, {
        editorVisible: false,
        detailVisible: true,
      });
      assert.equal(memoActionSheetReducer(false, { type: "open" }), true);
      assert.equal(memoActionSheetReducer(true, { type: "close" }), false);
      assert.equal(detailState.detailVisible, true);
    },
  },
  {
    name: "editing or removing a memo dismisses detail action layers",
    test: () => {
      const layeredState = {
        editorVisible: false,
        detailVisible: true,
      };

      assert.deepEqual(
        memoDetailFlowReducer(layeredState, { type: "openEditor" }),
        {
          editorVisible: true,
          detailVisible: false,
        }
      );
      assert.deepEqual(
        memoDetailFlowReducer(layeredState, { type: "closeAll" }),
        INITIAL_MEMO_DETAIL_FLOW
      );
    },
  },
  {
    name: "detail renders four direct actions in the requested order",
    test: () => {
      const detailSource = fs.readFileSync(
        path.join(__dirname, "../components/modal/MemoDetailModal.js"),
        "utf8"
      );
      const homeSource = fs.readFileSync(
        path.join(__dirname, "../components/memo/MemoHome.js"),
        "utf8"
      );
      const actionSource = fs.readFileSync(
        path.join(__dirname, "../components/modal/MemoActionModal.js"),
        "utf8"
      );
      const optionSource = fs.readFileSync(
        path.join(__dirname, "../utill/option.js"),
        "utf8"
      );

      assert.match(detailSource, /<MemoActionModal/);
      assert.doesNotMatch(homeSource, /<MemoActionModal/);

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
      assert.doesNotMatch(headerSource, /onEdit/);
      assert.match(detailSource, /label=\{i18n\.t\("searchAction"\)\}/);
      assert.match(detailSource, /destructive/);

      assert.doesNotMatch(optionSource, /getFixedActionOptions/);
    },
  },
  {
    name: "nested search sheet contains search services only",
    test: () => {
      const actionSource = fs.readFileSync(
        path.join(__dirname, "../components/modal/MemoActionModal.js"),
        "utf8"
      );

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
