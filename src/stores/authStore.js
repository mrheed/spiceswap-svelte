import { writable } from 'svelte/store';

function createAuth() {
  const state = {
    isAuthenticated: false
  }
  const { subscribe, set } = writable(state);

  function logout() {
    localStorage.removeItem('token');
    set({ ...state, isAuthenticated: false });
  }

  //@ts-ignore
  function login(accessToken) {
    localStorage.setItem('token', accessToken);
    set({ ...state, isAuthenticated: true });
  }

  return {
    subscribe,
    logout,
    login,
    //@ts-ignore
    setAuth: (value) => set({ ...state, isAuthenticated: value }),
  };
}

export const authStore = createAuth();

