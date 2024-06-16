<script>
	import { browseRecipesPaginate } from '@spiceswap/api/recipe';
	import Image from '@spiceswap/components/Image.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { writable } from 'svelte/store';
	import _ from 'lodash';
	import { page } from '$app/stores';
	import Bookmark from '@spiceswap/components/Recipe/Bookmark.svelte';
	import { StarOutline, StarSolid } from 'flowbite-svelte-icons';

	const recipes = writable([]);
	const pageNumber = writable(0);
	const sortBy = writable('newest');
	const pageable = writable({});

	async function browseRecipes(pageNumber, keyword, sortBy) {
		try {
			loadingStore.setLoading(true);
			const response = await browseRecipesPaginate(pageNumber, keyword, sortBy);
			const data = await response.json();
			if (response.ok) {
				recipes.set(data.results.content);
				pageable.set(data.results.pageable);
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

	$: {
		const urlParams = new URLSearchParams($page.url.search);
		const keyword = urlParams.get('keyword');
		debouncedBrowseRecipes($pageNumber, keyword, $sortBy);
	}
</script>

<div class="my-8 px-48">
	<h1>{t('pages.dashboard.recipe.browse-recipes.title')}</h1>
	<form class="flex flex-col gap-1 w-1/3">
		<label for="sort-by" class="block text-sm font-medium text-gray-900 dark:text-white font-bold"
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
	<div class="grid grid-cols-3 mt-8 gap-8">
		{#each $recipes as recipe}
			<div class="overflow-hidden rounded">
				<div class="h-48 bg-gray-2000 relative overlay-recipe">
					<Image
						props={{
							src: recipe.thumbnailImageLink,
							alt: recipe.recipeName,
							class: 'h-full w-full object-center object-cover'
						}}
					/>
					<div class="absolute top-2 left-4">
						<span class="text-gray-200">{recipe.createdAt}</span>
					</div>
					<div class="absolute bottom-4 right-4 cursor-pointer">
						<Bookmark {recipe} />
					</div>
				</div>
				<div class="flex justify-between px-1 py-2">
					<h2 class="font-medium">{recipe.recipeName}</h2>
					<span class="flex gap-2">
						<i class="w-4 h-4 text-yellow-400">
							<StarOutline />
						</i>
						<span class="font-medium">
							{recipe.totalRating}
						</span>
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.overlay-recipe::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.overlay-recipe {
		z-index: 1;
	}
</style>
