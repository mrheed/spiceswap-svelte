import { toasts } from "svelte-toasts";

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

/**
 * Converts a File object to a base64 encoded string.
 * @param {File} file - The file to be converted.
 * @returns {Promise<string>} - A promise that resolves with the base64 encoded string.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}


export function showToast(title, description, type = 'info') {
  toasts.add({
    title: title,
    description: description,
    duration: 3000,
    placement: 'bottom-right',
    showProgress: true,
    type: type,
    onClick: () => { },
    onRemove: () => { },
  });
}

export function getUrlParams(keyword = '') {
  const urlParams = new URLSearchParams(window.location.search);
  if (keyword) {
    return urlParams.get('keyword');
  }
  return urlParams;
}