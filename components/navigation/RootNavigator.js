import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMemoStore } from "../../hooks/useMemoStore";
import MemoHomeScreen from "../memo/MemoHomeScreen";
import MemoDetailScreen from "../memo/MemoDetailScreen";
import MemoInputModal from "../modal/MemoInputModal";

const {
  MEMO_HOME_ROUTE,
  MEMO_DETAIL_ROUTE,
} = require("../../utill/memoDetailFlow");

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const {
    folders,
    includePromptsFolder,
    editorVisible,
    editingMemo,
    editorFolderId,
    closeEditor,
    saveMemo,
  } = useMemoStore();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // iOS: let the user drag anywhere on the page to pop, not just the
          // left edge. Android falls back to the hardware back button.
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen
          name={MEMO_HOME_ROUTE}
          component={MemoHomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name={MEMO_DETAIL_ROUTE} component={MemoDetailScreen} />
      </Stack.Navigator>

      <MemoInputModal
        visible={editorVisible}
        memo={editingMemo}
        folders={folders}
        includePromptsFolder={includePromptsFolder}
        initialFolderId={editorFolderId}
        onClose={closeEditor}
        onSave={saveMemo}
      />
    </>
  );
}
