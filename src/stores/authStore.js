import { fetchV1Authorized, generateErrorMessage } from '@spiceswap/utils/fetch';
import { writable } from 'svelte/store';
import { loadingStore } from './loadingStore';
import { checkAccessToken, getUser, logoutUser } from '@spiceswap/api/auth';
import { showToast } from '@spiceswap/utils/common';
import { t } from '@spiceswap/locale/i18n';

function createAuth() {
  const state = {
    isAuthenticated: false,
    user: {}
  }
  const { subscribe, set, update } = writable(state);

  async function logout() {
    loadingStore.setLoading(true)
    try {
      await logoutUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ ...state, isAuthenticated: false });
    } catch (error) {
      showToast(t('auth.logout.error'), t('common.error', { error: error.message }), 'error');
    } finally {
      loadingStore.setLoading(false)
    }
  }

  function login() {
    set({ ...state, isAuthenticated: true });
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
    showToast(t(messageKey), generateErrorMessage(data), 'error');
    await authStore.logout();
  }

  async function refreshPage() {
    loadingStore.setLoading(true);
    try {
      await refreshAccessToken();
      await fetchUserData();
    } catch (error) {
      showToast(t('auth.logout.error'), t('common.error', { error: error.message }), 'error');
    } finally {
      loadingStore.setLoading(false);
    }
  }

  return {
    subscribe,
    logout,
    login,
    refreshPage,
    setAuth: (value) => set({ ...state, isAuthenticated: value }),
  };
}

export const authStore = createAuth();
