<script>
	import { page } from '$app/stores';
	import { getRecipeHistoryDetail } from '@spiceswap/api/recipe';
	import Alert from '@spiceswap/components/Alert.svelte';
	import RecipeHistoryDetail from '@spiceswap/components/Recipe/RecipeHistoryDetail.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { convertToIndonesianDate, generatePageTitleMeta } from '@spiceswap/utils/common';
	import { Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const slugHistory = $page.params.slugHistory;
	const isLoadingHistoryDetail = writable(true);
	const historyDetail = writable({});
	const historyTab = writable({
		isBefore: true,
		isAfter: false
	});

	const fetchRecipeHistory = async () => {
		isLoadingHistoryDetail.set(true);
		const response = await getRecipeHistoryDetail(slugHistory);
		const data = await response.json();
		if (response.ok) {
			historyDetail.set(data.results);
		} else {
			historyDetail.set({});
		}
		isLoadingHistoryDetail.set(false);
	};

	onMount(async () => {
		await loadingStore.wrapFn(fetchRecipeHistory);
	});
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.detail.history-detail.title'))}
</svelte:head>

<div class="my-8 px-64">
	<h1 class="font-bold text-4xl">{t('pages.dashboard.recipe.detail.history-detail.title')}</h1>
	{#if !$historyDetail.historySlug && !$isLoadingHistoryDetail}
		<div class="mt-8 flex justify-center items-center h-full w-full">
			<Alert
				type="warning"
				dismissed={false}
				dismissible={false}
				alertClass="w-full justify-center"
			>
				<p class="text-gray-600">{t('pages.dashboard.recipe.detail.history-detail.no-history')}</p>
			</Alert>
		</div>
	{/if}
	{#if $isLoadingHistoryDetail}
		<div class="w-full h-full flex justify-center items-center mt-16">
			<Spinner />
		</div>
	{:else}
		<div class="mt-16 bg-white rounded-lg shadow py-4 px-8">
			<Tabs contentClass="bg-white p-4">
				<TabItem
					title={t('pages.dashboard.recipe.detail.history-detail.before')}
					bind:open={$historyTab.isBefore}
				>
					<h2 class="font-bold text-2xl">
						{t('pages.dashboard.recipe.detail.history-detail.before')}
					</h2>
					<RecipeHistoryDetail
						ingredients={$historyDetail.previousRecipe.ingredientDetailJson}
						steps={$historyDetail.previousRecipe.stepJson}
						portion={$historyDetail.previousRecipe.portion}
					/>
				</TabItem>
				<TabItem
					title={t('pages.dashboard.recipe.detail.history-detail.after')}
					bind:open={$historyTab.isAfter}
				>
					<h2 class="font-bold text-2xl">
						{t('pages.dashboard.recipe.detail.history-detail.after')}
					</h2>
					<RecipeHistoryDetail
						ingredients={$historyDetail.currentRecipe.ingredientDetailJson}
						steps={$historyDetail.currentRecipe.stepJson}
						portion={$historyDetail.currentRecipe.portion}
					/>
				</TabItem>
			</Tabs>
		</div>
	{/if}
</div>
