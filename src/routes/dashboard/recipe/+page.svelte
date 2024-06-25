<script>
	import {
		getManageRecipes,
		updateStatusRecipe,
	} from '@spiceswap/api/recipe';
	import TablePagination from '@spiceswap/components/Table/TablePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
		convertToIndonesianDate,
		convertToTitleCase,
		generatePageTitleMeta,
		showToast
	} from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Badge, Button, Label, Modal, Search } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import _ from 'lodash';
	import Image from '@spiceswap/components/Image.svelte';
	import { RECIPE_STATUS } from '@spiceswap/common/constant';

	const toggleFetch = writable(false);
	const keyword = writable('');
	const recipes = writable([]);
	const pageNumber = writable(1);
	const paginationData = writable({
		totalPages: 1,
		pageSize: 10,
		totalData: 0
	});

	const recipeShow = writable({});
	const openModalShowRecipe = writable(false);

	async function fetchDataRecipes(pageNumber, keyword) {
		const response = await getManageRecipes(pageNumber - 1, keyword);
		const data = await response.json();
		if (response.ok) {
			recipes.set(data.results.content);
			paginationData.set({
				totalPages: data.results.totalPages,
				totalData: data.results.totalElements,
				pageSize: data.results.size
			});
		} else {
			recipes.set([]);
			showToast(
				t('pages.dashboard.recipes.error-get-recipes'),
				generateMessageFromResponse(data),
				'error'
			);
		}
		toggleFetch.set(false);
	}

	const getDataRecipes = (pageNumber, keyword) =>
		loadingStore.wrapFn(() => fetchDataRecipes(pageNumber, keyword));

	function handleSearch(e) {
		e.preventDefault();
		keyword.set(e.target.value);
	}

	function handleOpenModalShowRecipe(recipe) {
		recipeShow.set(recipe);
		openModalShowRecipe.set(true);
	}

	async function fetchUpdateStatusRecipe(recipeSlug) {
		const response = await updateStatusRecipe(recipeSlug);
		const data = await response.json();
		if (response.ok) {
			toggleFetch.set(true);
			showToast(
				t('pages.dashboard.recipes.toggle-status-success'),
				generateMessageFromResponse(data),
				'success'
			);
		} else {
			showToast(
				t('pages.dashboard.recipes.toggle-status-error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	}

	const toggleStatusRecipe = async (recipe) => {
		await loadingStore.wrapFn(async () => await fetchUpdateStatusRecipe(recipe.recipeSlug));
	};

	const debounceFetchDataRecipes = _.debounce(getDataRecipes, 500);

	$: debounceFetchDataRecipes($pageNumber, $keyword);
	$: if ($toggleFetch) debounceFetchDataRecipes($pageNumber, $keyword);
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipes.title'))}
</svelte:head>

<section class="bg-gray-50 dark:bg-gray-900 my-8">
	<div class="mx-auto max-w-screen-xl">
		<h1 class="font-bold text-gray-900">{t('pages.dashboard.recipes.title')}</h1>
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mt-8">
			<div
				class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
			>
				<div class="w-full md:w-1/2">
					<form on:submit={handleSearch}>
						<label for="simple-search" class="sr-only"
							>{t('pages.dashboard.recipes.search-label')}</label
						>
						<Search
							bind:value={$keyword}
							size="md"
							class="mt-1 w-96 border bg-white focus:outline-none"
							placeholder={t('pages.dashboard.recipes.search-placeholder')}
						/>
					</form>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.recipes.table.recipe-name')}</th
							>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.recipes.table.status')}</th
							>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.recipes.table.created-at')}</th
							>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.recipes.table.updated-at')}</th
							>
							<th scope="col" class="px-4 py-3 text-right"
								>{t('pages.dashboard.recipes.table.actions')}</th
							>
						</tr>
					</thead>
					<tbody>
						{#if $recipes.length === 0}
							<tr>
								<td colspan="99" class="text-center px-4 py-3"
									>{t('pages.dashboard.recipes.table.no-recipes')}</td
								>
							</tr>
						{/if}
						{#each $recipes as recipe}
							<tr>
								<td class="px-4 py-3">
									<div class="flex gap-2 items-center">
										<div class="w-10 h-10 rounded-lg overflow-hidden shadow-md">
											<Image
												props={{
													src: recipe.thumbnailImageLink,
													alt: t('pages.dashboard.recipes.table.recipe-name'),
													class: 'w-full h-full'
												}}
											/>
										</div>
										{convertToTitleCase(recipe.recipeName)}
									</div>
								</td>
								<td class="px-4 py-3">
									<Button color="none" class="px-0 py-0" on:click={toggleStatusRecipe(recipe)}>
										<Badge color={recipe.status === RECIPE_STATUS.ACTIVE ? 'green' : 'red'}
											>{recipe.status}</Badge
										>
									</Button>
								</td>
								<td class="px-4 py-3"
									>{convertToIndonesianDate(recipe.createdAt, { withTime: true })}</td
								>
								<td class="px-4 py-3"
									>{convertToIndonesianDate(recipe.updatedAt, { withTime: true })}</td
								>
								<td class="px-4 py-3 flex items-center justify-end">
									<button
										class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
										type="button"
										on:click={() => handleOpenModalShowRecipe(recipe)}
									>
										{t('pages.dashboard.recipes.table.show')}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<TablePagination
				bind:currentPage={$pageNumber}
				bind:totalData={$paginationData.totalData}
				bind:totalPages={$paginationData.totalPages}
			/>
		</div>
	</div>
</section>

<Modal
	title={t('pages.dashboard.recipes.show-recipe')}
	size="sm"
	bind:open={$openModalShowRecipe}
	on:close={() => openModalShowRecipe.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.recipes.show-recipe.name')}</Label>
			<p class="font-bold text-gray-900">{convertToTitleCase($recipeShow.recipeName)}</p>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.recipes.show-recipe.image')}</Label>
			<Image
				props={{
					src: $recipeShow.imageLink,
					alt: t('pages.dashboard.recipes.show-recipe.image'),
					class: 'w-full'
				}}
			/>
		</div>
	</div>
</Modal>
