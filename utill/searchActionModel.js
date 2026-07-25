const MAX_SEARCH_URL_LENGTH = 1900;

function encodeQueryWithinBudget(text, budget) {
  const normalizedText = String(text ?? "")
    .trim()
    .replace(/\s+/gu, " ");
  const characters = [...normalizedText];
  let encodedQuery = "";
  let consumedCharacters = 0;

  for (const character of characters) {
    const encodedCharacter = encodeURIComponent(character);
    if (encodedQuery.length + encodedCharacter.length > budget) {
      break;
    }
    encodedQuery += encodedCharacter;
    consumedCharacters += 1;
  }

  return {
    encodedQuery,
    truncated: consumedCharacters < characters.length,
  };
}

function buildSearchLaunchPlan(option, memoText) {
  if (!option || typeof option.baseUrl !== "string") {
    throw new TypeError("A search option with a baseUrl is required.");
  }

  if (option.copyToClipboard) {
    return {
      url: option.baseUrl,
      clipboardText: String(memoText ?? ""),
      truncated: false,
    };
  }

  const queryBudget = Math.max(
    0,
    MAX_SEARCH_URL_LENGTH - option.baseUrl.length
  );
  const { encodedQuery, truncated } = encodeQueryWithinBudget(
    memoText,
    queryBudget
  );

  return {
    url: `${option.baseUrl}${encodedQuery}`,
    clipboardText: null,
    truncated,
  };
}

async function executeSearchLaunch(
  plan,
  { copyText, openUrl } = {}
) {
  if (!plan || typeof plan.url !== "string" || typeof openUrl !== "function") {
    throw new TypeError("A launch plan and openUrl function are required.");
  }

  if (plan.clipboardText !== null) {
    if (typeof copyText !== "function") {
      throw new TypeError("copyText is required for clipboard launch plans.");
    }
    await copyText(plan.clipboardText);
  }

  await openUrl(plan.url);
}

module.exports = {
  MAX_SEARCH_URL_LENGTH,
  buildSearchLaunchPlan,
  executeSearchLaunch,
};
