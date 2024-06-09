import { writable } from 'svelte/store';

function createLoading() {
  const state = {
    isLoading: false
  }
  const { subscribe, set } = writable(state);

  return {
    subscribe,
    //@ts-ignore
    setLoading: (value) => set({ ...state, isLoading: value })
  };
}

export const loadingStore = createLoading();
