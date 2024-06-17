import { PUBLIC_API_URL } from "$env/static/public";

export const apiUrl = PUBLIC_API_URL;

export async function fetchData(endpoint, options = {}) {
  const url = `${apiUrl}/${endpoint}`;
  const response = await fetch(url, options);
  return response
}

export const API_V1_URL = `${apiUrl}/api/v1`;

export async function fetchV1(endpoint, options = {}) {
  const url = `${API_V1_URL}/${endpoint}`;
  const response = await fetch(url, options);
  return response
}

export async function fetchV1Authorized(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  const url = `${API_V1_URL}/${endpoint}`;
  const response = await fetch(url, options);
  return response
}

export function generateMessageFromResponse(response) {
  if (response.errors && response.errors.length > 0) {
    return response.errors.map(error => `${error.field} ${error.errorMessage}`).join('<br> ');
  }
  return response.message || 'An unknown error occurred';
}
