<script>
	import { getAllMyRecipesPaginate } from '@spiceswap/api/recipe';
	import RecipeGrid from '@spiceswap/components/Recipe/RecipeGrid.svelte';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { writable } from 'svelte/store';

	const recipes = writable([]);
	const page = writable(0);
	const totalPages = writable(0);

	async function getAllMyRecipes(page) {
		try {
			loadingStore.setLoading(true);
			const response = await getAllMyRecipesPaginate(page);
			const data = await response.json();
			if (response.ok) {
				recipes.set(data.results.content);
				totalPages.set(data.results.totalPages);
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

  function handlePageChange(_pageNumber) {
    page.set(_pageNumber - 1);
  }

	$: {
		getAllMyRecipes($page);
	}
</script>

<div class="my-8 px-48">
	<h1 class="font-bold">{t('pages.dashboard.recipe.my-recipes.title')}</h1>
	<RecipeGrid recipes={$recipes} withBookmark={false} gridCount={3}/>
	<div class="flex justify-center mt-8">
		<RecipePagination
			number={$page + 1}
			totalPages={$totalPages}
			onPageChange={handlePageChange}
		/>
	</div>
</div>
