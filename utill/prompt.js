import AsyncStorage from "@react-native-async-storage/async-storage";

const {
  createPrompt,
  updatePrompt,
  setPromptFavorite,
  markPromptUsed,
  migratePromptCollection,
  parseStoredPrompts,
} = require("./promptModel");

const PROMPTS_STORAGE_KEY = "prompts";

export async function getPrompts() {
  try {
    const jsonValue = await AsyncStorage.getItem(PROMPTS_STORAGE_KEY);
    return parseStoredPrompts(jsonValue);
  } catch (error) {
    console.error("Failed to fetch prompts from storage", error);
    return [];
  }
}

export async function storePrompts(prompts) {
  try {
    await AsyncStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
    return true;
  } catch (error) {
    console.error("Failed to store prompts", error);
    return false;
  }
}

export function buildPrompt(promptData) {
  return createPrompt(promptData);
}

export function buildUpdatedPrompt(existingPrompt, promptData) {
  return updatePrompt(existingPrompt, promptData);
}

export function buildFavoritePrompt(prompt, favorite) {
  return setPromptFavorite(prompt, favorite);
}

export function buildUsedPrompt(prompt) {
  return markPromptUsed(prompt);
}

export function sanitizePrompts(prompts) {
  return migratePromptCollection(prompts);
}
