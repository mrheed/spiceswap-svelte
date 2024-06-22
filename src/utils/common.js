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
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => {
      reject(error);
    };
    if (file instanceof File) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsDataURL(await urlToFile(file))
    }
  });
}

/**
 * Converts an image URL to a File object.
 * @param {string} imageUrl - The URL of the image to be converted.
 * @returns {Promise<File>} - A promise that resolves with the File object.
 */
export async function urlToFile(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const fileName = imageUrl.split('/').pop();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
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

/**
 * Converts a date string in the format 'YYYY-MM-DD' to an Indonesian date format.
 * @param {string} dateStr - The date string to be converted.
 * @returns {string} - The date in Indonesian format 'Hari, tanggal bulan tahun'.
 */
export function convertToIndonesianDate(dateStr, opts = {}) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const date = new Date(dateStr);
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (opts.withTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
  }

  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Converts a string into a title case.
 * @param {string} string - The string to be converted.
 * @returns {string} - The string in title case.
 */
export function convertToTitleCase(string) {
  if (!string) return ''
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function gotoPublicDetailRecipe(recipeSlug) {
  goto(`/browse/recipes/${recipeSlug}`);
}