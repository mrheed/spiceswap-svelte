<script lang="ts">
	import { page } from '$app/stores';
	import { getBrowseRecipeDetail } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { generatePageTitleMeta, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const recipe = writable({});

	onMount(async () => {
		await loadingStore.wrapFn(async () => {
			const response = await getBrowseRecipeDetail(recipeSlug);
			const data = await response.json();
			if (response.ok) {
				// recipe.set(data)
			} else {
				showToast(
					t('pages.dashboard.recipe.browse-recipes.detail.error'),
					generateMessageFromResponse(data),
					'error'
				);
			}
		});
	});
</script>

<svelte:head>
  {@html generatePageTitleMeta(t('pages.dashboard.recipe.browse-recipes.detail.title'))}
</svelte:head>

<div class="px-16 mt-8">
	<h1 class="font-bold">{t('pages.dashboard.recipe.browse-recipes.detail.title')}</h1>
</div>
