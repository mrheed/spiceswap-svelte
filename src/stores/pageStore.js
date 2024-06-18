import { writable } from "svelte/store";

const createPageStore = () => {
  const state = {
    scene: 'home',
    previousScene: '',
    isForbidden: true
  }

  const { subscribe, update, set } = writable(state);

  const setScene = (scene) => {
    update(state => ({ ...state, scene }));
  }

  const isCurrentScene = (scene) => {
    return state.scene === scene
  }

  const isAllowedToRequest = (scene) => {
    return state.isForbidden && isCurrentScene(scene)
  }

  const setForbidden = (forbidden) => {
    update(state => ({ ...state, isForbidden: forbidden }));
  }

  return {
    subscribe,
    set,
    update,
    setScene,
    isCurrentScene,
    setForbidden,
    isAllowedToRequest
  }
}

export const pageStore = createPageStore()