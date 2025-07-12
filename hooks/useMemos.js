import { useState, useEffect } from "react";
import { getCurrentDate, getMemos, storeMemos } from "../utill/memo";

export function useMemos() {
  const [memos, setMemos] = useState([]);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    getMemos().then((loadedMemos) => {
      if (loadedMemos?.length) {
        setMemos(loadedMemos);
      }
      setIsInit(true);
    });
  }, []);

  useEffect(() => {
    if (isInit) {
      storeMemos(memos);
    }
  }, [memos, isInit]);

  const addMemo = (memoData) => {
    setMemos((currentMemos) => [
      {
        text: memoData.text.trim(),
        id: Date.now(),
        date: getCurrentDate(),
        color: memoData.color,
      },
      ...currentMemos,
    ]);
  };

  const updateMemo = (memoData) => {
    setMemos((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === memoData.id
          ? {
              ...memo,
              text: memoData.text.trim(),
              date: getCurrentDate(),
              color: memoData.color,
            }
          : memo
      )
    );
  };

  const deleteMemo = (id) => {
    setMemos((currentMemos) => currentMemos.filter((memo) => memo.id !== id));
  };

  return {
    memos,
    isInit,
    addMemo,
    updateMemo,
    deleteMemo,
  };
}
