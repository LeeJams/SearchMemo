import { useState, useEffect } from "react";
import { buildMemo, buildUpdatedMemo, getMemos, storeMemos } from "../utill/memo";

export function useMemos() {
  const [memos, setMemos] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMemos()
      .then((loadedMemos) => {
        if (!isMounted) return;
        setMemos(loadedMemos);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Failed to initialize memos", error);
        setStorageError(error);
      })
      .finally(() => {
        if (isMounted) {
          setIsInit(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isInit) {
      storeMemos(memos).then((success) => {
        if (!success) {
          setStorageError(new Error("Failed to store memos"));
        }
      });
    }
  }, [memos, isInit]);

  const addMemo = (memoData) => {
    setMemos((currentMemos) => [buildMemo(memoData), ...currentMemos]);
  };

  const updateMemo = (memoData) => {
    setMemos((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === memoData.id ? buildUpdatedMemo(memo, memoData) : memo
      )
    );
  };

  const deleteMemo = (id) => {
    setMemos((currentMemos) => currentMemos.filter((memo) => memo.id !== id));
  };

  return {
    memos,
    isInit,
    storageError,
    addMemo,
    updateMemo,
    deleteMemo,
  };
}
