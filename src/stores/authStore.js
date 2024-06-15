import { fetchV1Authorized } from '@spiceswap/utils/fetch';
import { writable } from 'svelte/store';
import { loadingStore } from './loadingStore';
import { logoutUser } from '@spiceswap/api/auth';

function createAuth() {
  const state = {
    isAuthenticated: false
  }
  const { subscribe, set } = writable(state);

  async function logout() {
    loadingStore.setLoading(true)
    try {
      await logoutUser();
      localStorage.removeItem('token');
      set({ ...state, isAuthenticated: false });
    } catch (error) {
    } finally {
      loadingStore.setLoading(false)
    }
  }

  function login(accessToken) {
    localStorage.setItem('token', accessToken);
    set({ ...state, isAuthenticated: true });
  }

  return {
    subscribe,
    logout,
    login,
    setAuth: (value) => set({ ...state, isAuthenticated: value }),
  };
}

export const authStore = createAuth();

