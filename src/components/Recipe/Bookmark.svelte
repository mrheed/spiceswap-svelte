<script>
	import { bookmarkRecipe } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { BookmarkOutline, BookmarkSolid } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	export let recipe;

	const bookmarkStatus = writable(!!recipe.isBookmarked);

	const toggleBookmark = async () =>
		await loadingStore.wrapFn(async () => {
			const response = await bookmarkRecipe(recipe.recipeSlug);
			const data = await response.json();
			if (response.ok) {
				bookmarkStatus.update((status) => !status);
				showToast(t('common.recipe.bookmark.success'), generateMessageFromResponse(data), 'success');
			} else {
				showToast(t('common.recipe.bookmark.error'), generateMessageFromResponse(data), 'error');
			}
		});

</script>

<button on:click={toggleBookmark}>
	{#if $bookmarkStatus}
		<BookmarkOutline
			strokeWidth="1"
			class="w-6 h-6 text-gray-500 hover:text-yellow-400 transition-all"
		/>
	{:else}
		<BookmarkSolid class="w-6 h-6 text-yellow-300 hover:text-yellow-400 transition-all" />
	{/if}
</button>
