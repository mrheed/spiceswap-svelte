<script>
	import { browseRecipesPaginate } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { writable } from 'svelte/store';
	import _ from 'lodash';
	import { page } from '$app/stores';
	import RecipeGrid from '@spiceswap/components/Recipe/RecipeGrid.svelte';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';

	const recipes = writable([]);
	const pageNumber = writable(0);
	const sortBy = writable('newest');
	const totalPages = writable(0);

	async function browseRecipes(pageNumber, keyword, sortBy) {
		try {
			loadingStore.setLoading(true);
			const response = await browseRecipesPaginate(pageNumber, keyword, sortBy);
			const data = await response.json();
			if (response.ok) {
				recipes.set(data.results.content);
				totalPages.set(data.results.totalPages);
			} else {
				showToast(
					t('pages.dashboard.recipe.browse-recipes.error'),
					generateErrorMessage(data),
					'error'
				);
			}
		} catch (error) {
			showToast(
				t('pages.dashboard.recipe.browse-recipes.error'),
				t('common.error', { error: error.message }),
				'error'
			);
		} finally {
			loadingStore.setLoading(false);
		}
	}

	const debouncedBrowseRecipes = _.debounce((pageNumber, keyword, sortBy) => {
		browseRecipes(pageNumber, keyword, sortBy);
	}, 300);

	function handlePageChange(_pageNumber) {
		pageNumber.set(_pageNumber - 1);
	}

	$: {
		const urlParams = new URLSearchParams($page.url.search);
		const keyword = urlParams.get('keyword') ? urlParams.get('keyword') : '';
		debouncedBrowseRecipes($pageNumber, keyword, $sortBy);
	}
</script>

<div class="my-8 px-16">
	<h1 class="font-bold">{t('pages.dashboard.recipe.browse-recipes.title')}</h1>
	<form class="flex flex-col gap-1 mt-16 w-1/3">
		<label for="sort-by" class="block font-medium text-gray-900 dark:text-white font-bold"
			>{t('pages.dashboard.recipe.browse-recipes.sort-by')}</label
		>
		<select
			id="sort-by"
			bind:value={$sortBy}
			class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		>
			<option value="newest">{t('pages.dashboard.recipe.browse-recipes.newest')}</option>
			<option value="oldest">{t('pages.dashboard.recipe.browse-recipes.oldest')}</option>
			<option value="popular">{t('pages.dashboard.recipe.browse-recipes.popular')}</option>
		</select>
	</form>
	<RecipeGrid recipes={$recipes} />
	<div class="flex justify-center mt-16">
		<RecipePagination number={$pageNumber + 1} totalPages={$totalPages} onPageChange={handlePageChange} />
	</div>
</div>
