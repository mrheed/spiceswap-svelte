import { PUBLIC_API_URL } from "$env/static/public";

export const apiUrl = PUBLIC_API_URL;

// @ts-ignore
export async function fetchData(endpoint, options = {}) {
  const url = `${apiUrl}/${endpoint}`;
  const response = await fetch(url, options);
  return response
}

export const API_V1_URL = `${apiUrl}/api/v1`;

// @ts-ignore
export async function fetchV1(endpoint, options = {}) {
  const url = `${API_V1_URL}/${endpoint}`;
  const response = await fetch(url, options);
  return response
}


//@ts-ignore
export function generateErrorMessage(response) {
  const statuses = [
    'BAD_REQUEST',
    'NOT_FOUND'
  ]
  if (statuses.includes(response.status) && response.errors && response.errors.length > 0) {
    // @ts-ignore
    return response.errors.map(error => `${error.errorMessage}`).join('<br> ');
  }
  return response.message || 'An unknown error occurred';
}
