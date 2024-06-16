<script>
	import { getAllMyRecipesPaginate } from '@spiceswap/api/recipe';
	import Image from '@spiceswap/components/Image.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { writable } from 'svelte/store';

	const recipes = writable([]);
	const page = writable(0);

	async function getAllMyRecipes(page) {
		try {
			loadingStore.setLoading(true);
			const response = await getAllMyRecipesPaginate(page);
			const data = await response.json();
			if (response.ok) {
				recipes.set(data.results.content);
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

	$: {
		getAllMyRecipes($page);
	}
</script>

<div class="my-8 px-48">
	<h1>{t('pages.dashboard.recipe.my-recipes.title')}</h1>
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
				</div>
				<div class="flex justify-between px-1 py-2">
					<h2>{recipe.recipeName}</h2>
					<span>{recipe.totalRating}</span>
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
