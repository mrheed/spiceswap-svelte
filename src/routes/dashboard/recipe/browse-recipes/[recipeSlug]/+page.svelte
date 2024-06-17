<script lang="ts">
	import { page } from '$app/stores';
	import { getBrowseRecipeDetail } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const recipe = writable({});

	onMount(async () => {
		try {
			loadingStore.setLoading(true);
			const response = await getBrowseRecipeDetail(recipeSlug);
			const data = await response.json();
			if (response.ok) {
				// recipe.set(data)
			} else {
				showToast(
					t('pages.dashboard.recipe.browse-recipes.detail.error'),
					generateErrorMessage(data),
					'error'
				);
			}
		} catch (error) {
			showToast(
				t('pages.dashboard.recipe.browse-recipes.detail.error'),
				t('common.error', { error }),
				'error'
			);
		} finally {
			loadingStore.setLoading(false);
		}
	});
</script>

<div class="px-16 mt-8">
	<h1 class="font-bold">{t('pages.dashboard.recipe.browse-recipes.detail.title')}</h1>
</div>
