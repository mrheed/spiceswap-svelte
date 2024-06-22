<script>
	import { page } from '$app/stores';
	import { getUpdateRecipeData } from '@spiceswap/api/recipe';
	import Dropzone from '@spiceswap/components/Dropzone.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { generatePageTitleMeta, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, Input, Label, Spinner, Textarea } from 'flowbite-svelte';
	import { FloppyDiskOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const loading = writable(true);

	const fetchUpdateRecipeData = async () => {
		const response = await getUpdateRecipeData(recipeSlug);
		const data = await response.json();
		if (response.ok) {
      console.log(data)
		} else {
			showToast(
				t('pages.dashboard.recipe.update.errorTitle'),
				generateMessageFromResponse(data),
				'error'
			);
		}
		loading.set(false);
	};

	function handleInputChange(event, store, key = null) {
		if (key) {
			store.update((currentValues) => ({ ...currentValues, [key]: event.target.value }));
		} else {
			store.set(event.target.value);
		}
	}

	function handleSaveUpdateRecipe() {
	}

	onMount(async () => {
		await loadingStore.wrapFn(fetchUpdateRecipeData);
	});
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.update.title'))}
</svelte:head>

{#if !$loading}
	<div class="px-16 mt-8">
		<h1 class="font-bold">{t('pages.dashboard.recipe.update.title')}</h1>

		<div class="mt-8 pt-8 px-8 bg-white rounded-lg py-8 shadow">

			<hr class="border-t border-gray-200 my-8" />

			<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleSaveUpdateRecipe}>
				<FloppyDiskOutline />
				{t('pages.dashboard.recipe.update.save')}</Button
			>
		</div>
	</div>
{:else}
	<div class="w-full h-full flex justify-center items-center mt-16">
		<Spinner />
	</div>
{/if}
