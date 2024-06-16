<script>
	import { bookmarkRecipe } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { BookmarkOutline, BookmarkSolid } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	export let recipe;

	const bookmarkStatus = writable(!!recipe.canBookmark);

	const toggleBookmark = async () => {
		try {
			loadingStore.setLoading(true);
			const response = await bookmarkRecipe(recipe.recipeSlug);
			const data = await response.json();
			if (response.ok) {
				bookmarkStatus.update((status) => !status);
			} else {
				showToast(t('common.recipe.bookmark.error'), generateErrorMessage(data), 'error');
			}
		} catch (error) {
			console.error(error);
			showToast(
				t('common.recipe.bookmark.error'),
				t('common.error', { error: error.message }),
				'error'
			);
		} finally {
			loadingStore.setLoading(false);
		}
	};
</script>

<button
	on:click={toggleBookmark}
	class="bg-transparent text-gray-100 hover:text-gray-300 border border-gray-100 hover:border-gray-300 rounded px-2 py-1"
>
	{#if $bookmarkStatus}
		<BookmarkOutline class="w-6 h-6" />
	{:else}
		<BookmarkSolid class="w-6 h-6" />
	{/if}
</button>
