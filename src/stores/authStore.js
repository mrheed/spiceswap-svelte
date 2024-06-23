import { fetchV1Authorized, generateMessageFromResponse } from '@spiceswap/utils/fetch';
import { writable } from 'svelte/store';
import { loadingStore } from './loadingStore';
import { checkAccessToken, getUser, logoutUser } from '@spiceswap/api/auth';
import { showToast } from '@spiceswap/utils/common';
import { t } from '@spiceswap/locale/i18n';

function createAuth() {
  const state = {
    isAuthenticated: false,
    checkingSession: true,
    user: {}
  }
  const { subscribe, set, update } = writable(state);

  async function logout() {
    await loadingStore.wrapFn(async () => {
      // await logoutUser();
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      update(state => ({ ...state, isAuthenticated: false }));
    })
  }

  function login() {
    update(state => ({ ...state, isAuthenticated: true }));
  }

  async function refreshAccessToken() {
    const response = await checkAccessToken();
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('accessToken', data.results.accessToken);
      authStore.login();
    } else {
      handleAuthError(data, 'auth.token_expired');
    }
  }

  async function fetchUserData() {
    const response = await getUser();
    const data = await response.json();
    if (response.ok) {
      update(state => ({ ...state, user: data.results }));
    } else {
      handleAuthError(data, 'auth.user.error');
    }
  }

  async function handleAuthError(data, messageKey) {
    showToast(t(messageKey), generateMessageFromResponse(data), 'error');
    await authStore.logout();
  }

  async function refreshPage() {
    await loadingStore.wrapFn(async () => {
      if (localStorage.getItem('accessToken')) {
        await refreshAccessToken();
        await fetchUserData();
      }
      update(state => ({ ...state, checkingSession: false }))
    })
  }

  return {
    subscribe,
    logout,
    login,
    refreshPage,
    fetchUserData,
    setAuth: (value) => set({ ...state, isAuthenticated: value }),
  };
}

export const authStore = createAuth();
