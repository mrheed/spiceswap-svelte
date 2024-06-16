<script>
	import { getAllMyRecipesPaginate } from '@spiceswap/api/recipe';
	import Image from '@spiceswap/components/Image.svelte';
	import RecipeGrid from '@spiceswap/components/Recipe/RecipeGrid.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { StarOutline, StarSolid } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	const recipes = writable([]);
	const page = writable(0);

	async function getAllMyRecipes(page) {
		try {
			loadingStore.setLoading(true);
			const response = await getAllMyRecipesPaginate(page);
			const data = await response.json();
			if (response.ok) {
				recipes.set(data.results.content);
			} else {
				showToast(
					t('pages.dashboard.recipe.my-recipes.get-all.error'),
					generateErrorMessage(data),
					'error'
				);
			}
		} catch (error) {
			showToast(
				t('pages.dashboard.recipe.my-recipes.get-all.error'),
				t('common.error', { error: error.message }),
				'error'
			);
		} finally {
			loadingStore.setLoading(false);
		}
	}

	$: {
		getAllMyRecipes($page);
	}
</script>

<div class="my-8 px-16">
	<h1 class="font-bold">{t('pages.dashboard.recipe.my-recipes.title')}</h1>
	<RecipeGrid recipes={$recipes} withBookmark={false} />
</div>
