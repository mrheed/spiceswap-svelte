import { writable } from 'svelte/store';

function createLoading() {
  const state = {
    isLoading: false,
    isFullPageLoading: false
  }
  const { subscribe, set } = writable(state);

  return {
    subscribe,
    setLoading: (value) => set({ ...state, isLoading: value }),
    setFullPageLoading: (value) => set({ ...state, isFullPageLoading: value })
  };
}

export const loadingStore = createLoading();
