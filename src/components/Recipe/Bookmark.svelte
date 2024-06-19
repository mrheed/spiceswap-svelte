<script>
	import { bookmarkRecipe, unbookmarkRecipe } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { BookmarkOutline, BookmarkSolid } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	export let recipe;
  export let buttonClass = '';

	const isBookmarked = writable(recipe.isBookmarked === true);

	const fetchBookmark = async () => {
		const response = await bookmarkRecipe(recipe.recipeSlug);
		const data = await response.json();
		if (response.ok) {
			isBookmarked.set(true);
			showToast(t('common.recipe.bookmark.success'), generateMessageFromResponse(data), 'success');
		} else {
			showToast(t('common.recipe.bookmark.error'), generateMessageFromResponse(data), 'error');
		}
	};

	const fetchUnbookmark = async () => {
		const response = await unbookmarkRecipe(recipe.recipeSlug);
		const data = await response.json();
		if (response.ok) {
			isBookmarked.set(false);
			showToast(
				t('common.recipe.unbookmark.success'),
				generateMessageFromResponse(data),
				'success'
			);
		} else {
			showToast(t('common.recipe.unbookmark.error'), generateMessageFromResponse(data), 'error');
		}
	};

	const toggleBookmark = async () =>
		await loadingStore.wrapFn(async () => {
			if ($isBookmarked) {
				await fetchUnbookmark();
			} else {
				await fetchBookmark();
			}
		});
</script>

<button on:click={toggleBookmark} class={buttonClass}>
	{#if $isBookmarked}
		<BookmarkSolid class="w-6 h-6 text-yellow-300 hover:text-yellow-400 transition-all" />
	{:else}
		<BookmarkOutline
			strokeWidth="1"
			class="w-6 h-6 text-gray-500 hover:text-yellow-400 transition-all"
		/>
	{/if}
  <slot />
</button>
