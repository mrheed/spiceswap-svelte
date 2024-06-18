import { writable } from "svelte/store";

export const pageForbiddenStore = () => {
  const state = {
    isForbidden: true
  }
  const { subscribe, set } = writable(true)
  const isForbidden = () => state.isForbidden
  return {
    subscribe,
    set,
    isForbidden
  }
}

const createPageStore = () => {
  const state = {
    scene: 'home',
    previousScene: '',
  }

  const { subscribe, update, set } = writable(state);

  const setScene = (scene) => {
    update(state => ({ ...state, scene }));
  }

  const isCurrentScene = (scene) => {
    return state.scene === scene
  }

  return {
    subscribe,
    set,
    update,
    setScene,
    isCurrentScene,
  }
}

export const pageStore = createPageStore()