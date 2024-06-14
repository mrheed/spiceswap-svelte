/**
 * Generates a meta tag for the page title.
 * @param {string} title - The title of the page.
 * @returns {string} - The meta tag for the page title.
 */
export function generatePageTitleMeta(title) {
  return `<title>SpiceSwap | ${title}</title>`;
}

// @ts-ignore
export function getParamValue(param) {
  const urlParams = window.location.search.substring(1).split('&');
  for (let i = 0; i < urlParams.length; i++) {
    const paramPair = urlParams[i].split('=');
    if (paramPair[0] === param) {
      return paramPair[1]
    }
  }
  return null;
}
