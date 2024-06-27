<script>
	import { page } from '$app/stores';
	import { getRecipeHistory } from '@spiceswap/api/recipe';
	import Alert from '@spiceswap/components/Alert.svelte';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
		convertToIndonesianDate,
		generatePageTitleMeta,
	} from '@spiceswap/utils/common';
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const recipeHistory = writable({});
	const loadingRecipe = writable(true);
	const pageNumber = writable(0);
	const totalPages = writable(0);

	const fetchRecipeHistory = async () => {
		loadingRecipe.set(true);
		const response = await getRecipeHistory(recipeSlug, $pageNumber);
		const data = await response.json();
		if (response.ok) {
			recipeHistory.set(data.results.historyDetailResponses.content);
			totalPages.set(data.results.historyDetailResponses.totalPages);
		} else {
			recipeHistory.set([]);
			totalPages.set(0);
		}
		loadingRecipe.set(false);
	};

	onMount(async () => {
		await loadingStore.wrapFn(fetchRecipeHistory);
	});
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.detail.history.title'))}
</svelte:head>

<div class="my-8 px-64">
	<h1 class="font-bold text-4xl">{t('pages.dashboard.recipe.detail.history.title')}</h1>
	{#if $recipeHistory.length === 0 && !$loadingRecipe}
		<div class="mt-8 flex justify-center items-center h-full w-full">
			<Alert
				type="warning"
				dismissed={false}
				dismissible={false}
				alertClass="w-full justify-center"
			>
				<p class="text-gray-600">{t('pages.dashboard.recipe.detail.history.no-history')}</p>
			</Alert>
		</div>
	{/if}
	{#if $loadingRecipe}
		<div class="w-full h-full flex justify-center items-center mt-16">
			<Spinner />
		</div>
	{:else}
		<ul class="mt-16 mb-6 flex flex-col gap-2">
			{#each $recipeHistory as history}
				<li class="pb-3 sm:pb-4 bg-white rounded-lg py-4 px-6 shadow">
					<div class="flex gap-2 justify-between items-center">
						<div class="flex gap-6">
							<p class="text-sm font-bold">{convertToIndonesianDate(history.updateAt, {withTime: true})}</p>
							<p class="text-sm font-semibold">
								{t('pages.dashboard.recipe.detail.history.updated-by', {
									updatedBy: history.updatedBy
								})}
							</p>
						</div>
						<a
							href={`/browse/recipes/${recipeSlug}/history/${history.slugHistory}`}
							class="text-blue-500 hover:text-blue-600 text-sm"
						>
							{t('pages.dashboard.recipe.detail.history.view')}
						</a>
					</div>
				</li>
			{/each}
		</ul>
		<div class="flex justify-end">
			<RecipePagination pageNumber={$pageNumber} totalPages={$totalPages} />
		</div>
	{/if}
</div>
