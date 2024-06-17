import { t } from '@spiceswap/locale/i18n';
import { showToast } from '@spiceswap/utils/common';
import { writable } from 'svelte/store';

function createLoading() {
  const state = {
    isLoading: false,
    isFullPageLoading: false
  }
  const { subscribe, set, update } = writable(state);

  async function wrapFn(fn, ...args) {
    return (async (...args) => {
      try {
        setLoading(true);
        const result = await fn(...args);
        return result;
      } catch (error) {
        console.error(error)
        showToast(t('common.error'), error.message, 'error');
      } finally {
        setLoading(false);
      }
    })(...args);
  }

  function setLoading(value) {
    update(state => ({ ...state, isLoading: value }));
  }

  function setFullPageLoading(value) {
    update(state => ({ ...state, isFullPageLoading: value }));
  }

  return {
    subscribe,
    wrapFn,
    setLoading,
    setFullPageLoading
  };
}

export const loadingStore = createLoading();
