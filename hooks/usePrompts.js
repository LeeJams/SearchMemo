import { useEffect, useState } from "react";
import {
  buildFavoritePrompt,
  buildPrompt,
  buildUpdatedPrompt,
  buildUsedPrompt,
  getPrompts,
  sanitizePrompts,
  storePrompts,
} from "../utill/prompt";

export function usePrompts() {
  const [prompts, setPrompts] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getPrompts()
      .then((loadedPrompts) => {
        if (isMounted) {
          setPrompts(loadedPrompts);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Failed to initialize prompts", error);
          setStorageError(error);
        }
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
      storePrompts(prompts).then((success) => {
        if (!success) {
          setStorageError(new Error("Failed to store prompts"));
        }
      });
    }
  }, [prompts, isInit]);

  const addPrompt = (promptData) => {
    setPrompts((currentPrompts) => [
      buildPrompt(promptData),
      ...currentPrompts,
    ]);
  };

  const updatePrompt = (promptData) => {
    setPrompts((currentPrompts) =>
      currentPrompts.map((prompt) =>
        prompt.id === promptData.id
          ? buildUpdatedPrompt(prompt, promptData)
          : prompt
      )
    );
  };

  const deletePrompt = (id) => {
    setPrompts((currentPrompts) =>
      currentPrompts.filter((prompt) => prompt.id !== id)
    );
  };

  const toggleFavorite = (id) => {
    setPrompts((currentPrompts) =>
      currentPrompts.map((prompt) =>
        prompt.id === id
          ? buildFavoritePrompt(prompt, !prompt.favorite)
          : prompt
      )
    );
  };

  const markUsed = (id) => {
    setPrompts((currentPrompts) =>
      currentPrompts.map((prompt) =>
        prompt.id === id ? buildUsedPrompt(prompt) : prompt
      )
    );
  };

  const replacePrompts = (nextPrompts) => {
    setPrompts(sanitizePrompts(nextPrompts));
  };

  return {
    prompts,
    isInit,
    storageError,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    markUsed,
    replacePrompts,
  };
}
