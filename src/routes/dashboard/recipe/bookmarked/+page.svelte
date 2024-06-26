<script>
	import { getAllBookmarkedRecipesPaginate } from '@spiceswap/api/recipe';
	import RecipeGrid from '@spiceswap/components/Recipe/RecipeGrid.svelte';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { generatePageTitleMeta, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { writable } from 'svelte/store';

	const recipes = writable([]);
	const page = writable(0);
	const totalPages = writable(0);
  const isLoading = writable(true)

	const fetchAllBookmarkedRecipes = async (page) => {
    isLoading.set(true)
		const response = await getAllBookmarkedRecipesPaginate(page);
		const data = await response.json();
		if (response.ok) {
			recipes.set(data.results.content);
			totalPages.set(data.results.totalPages);
		} else {
			showToast(
				t('pages.dashboard.recipe.bookmarked-recipes.get-all.error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
    isLoading.set(false)
	};

	const getAllBookmarkedRecipes = async (page) =>
		await loadingStore.wrapFn(async () => await fetchAllBookmarkedRecipes(page));

	function handlePageChange(_pageNumber) {
		page.set(_pageNumber - 1);
	}

	const getBookmarkedRecipeDetailLink = (recipe) => `/browse/recipes/${recipe.recipeSlug}`;

	$: getAllBookmarkedRecipes($page);
</script>

<svelte:head>
  {@html generatePageTitleMeta(t('pages.dashboard.recipe.bookmarked-recipes.title'))}
</svelte:head>

<div class="my-8 px-48">
	<h1 class="font-bold">{t('pages.dashboard.recipe.bookmarked-recipes.title')}</h1>
	<RecipeGrid
		recipes={$recipes}
		gridCount={3}
    isLoading={$isLoading}
		detailLink={getBookmarkedRecipeDetailLink}
	/>
	<div class="flex justify-center mt-8">
		<RecipePagination number={$page + 1} totalPages={$totalPages} onPageChange={handlePageChange} />
	</div>
</div>
