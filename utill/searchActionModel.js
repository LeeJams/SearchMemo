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

function buildAIPrefillUrl(option, text) {
  if (typeof option.prefillUrl !== "string") return null;

  try {
    const encodedText = encodeURIComponent(text);
    const url = option.prefillUrl + encodedText + (option.prefillSuffix || "");
    // Send the complete memo or keep the clipboard flow; never prefill a fragment.
    return url.length <= MAX_SEARCH_URL_LENGTH ? url : null;
  } catch {
    // A malformed UTF-16 string can still be copied, even when it cannot be URL-encoded.
    return null;
  }
}

function buildSearchLaunchPlan(option, memoText, platform) {
  if (!option || typeof option.baseUrl !== "string") {
    throw new TypeError("A search option with a baseUrl is required.");
  }

  if (option.copyToClipboard) {
    const text = String(memoText ?? "");
    const prefillUrl = buildAIPrefillUrl(option, text);
    const appUrl = platform === "ios"
      ? option.iosAppUrl || option.appUrl
      : option.appUrl;
    return {
      url: prefillUrl || appUrl || option.baseUrl,
      fallbackUrl: (prefillUrl || appUrl) ? option.baseUrl : null,
      clipboardText: text,
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

  try {
    await openUrl(plan.url);
  } catch (error) {
    if (!plan.fallbackUrl || plan.fallbackUrl === plan.url) {
      throw error;
    }
    await openUrl(plan.fallbackUrl);
  }
}

module.exports = {
  MAX_SEARCH_URL_LENGTH,
  buildSearchLaunchPlan,
  executeSearchLaunch,
};
