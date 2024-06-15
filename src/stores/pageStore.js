import { writable } from "svelte/store";

export const pageStore = writable({
  scene: 'home'
});