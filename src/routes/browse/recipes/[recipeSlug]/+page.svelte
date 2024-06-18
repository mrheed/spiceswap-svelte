<script>
	import { page } from '$app/stores';
	import { getBrowseRecipeDetail } from '@spiceswap/api/recipe';
	import Image from '@spiceswap/components/Image.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { convertToTitleCase, generatePageTitleMeta, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Avatar, Button, Spinner } from 'flowbite-svelte';
	import { ClockOutline, CogOutline, EditOutline, FileCopyOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const recipe = writable({});
	const loadingRecipe = writable(true);

	const fetchRecipeDetail = async () => {
		const response = await getBrowseRecipeDetail(recipeSlug);
		const data = await response.json();
		if (response.ok) {
			recipe.set(data.results);
		} else {
			showToast(
				t('pages.dashboard.recipe.browse-recipes.detail.error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
		loadingRecipe.set(false);
	};

	onMount(async () => {
		await loadingStore.wrapFn(async () => await fetchRecipeDetail());
	});
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.browse-recipes.detail.title'))}
</svelte:head>

<div class="px-16 mt-8">
	<h1 class="font-bold">{t('pages.dashboard.recipe.browse-recipes.detail.title')}</h1>
</div>
{#if !$loadingRecipe}
	<div class="px-16 py-8 flex gap-8 mt-8 bg-white rounded-lg shadow-2xl overflow-hidden">
		<div class="w-3/4">
			<div style="height: 500px;" class="-mt-8 -ms-16">
				<Image
					props={{
						src: $recipe.thumbnailImageLink,
						alt: $recipe.recipeName,
						class: 'w-full h-full object-center object-cover rounded-br-lg'
					}}
				/>
			</div>
			<div class="flex items-center gap-2 mt-8">
				<span class="text-title text-3xl">{convertToTitleCase($recipe.recipeName)}</span>
				<span class="text-sm italic"
					>{t('pages.dashboard.recipe.browse-recipes.detail.portion', {
						portion: $recipe.portion
					})}</span
				>
			</div>
			<p class="mt-4 flex gap-4 items-center text-sm"><Avatar size="sm" />{$recipe.owner}</p>
			<p class="mt-8">{$recipe.about}</p>
			<div class="mt-8 flex justify-between">
				<span class="font-semibold text-sm">
					{t('pages.dashboard.recipe.browse-recipes.detail.type')}: {$recipe.recipeType}
				</span>
				<Button color="none" class="flex gap-2">
					<FileCopyOutline />
					{t('pages.dashboard.recipe.browse-recipes.detail.copy')}
				</Button>
			</div>
			<div class="flex gap-8">
				<div class="w-1/2">
					<h3 class="text-2xl font-bold mb-2">
						{t('pages.dashboard.recipe.browse-recipes.detail.ingredients')}
					</h3>
					<ul>
						{#each $recipe.ingredientDetailResponses as ingredient}
							<li class="text-sm">- {ingredient.dose} {ingredient.ingredientName}</li>
						{/each}
					</ul>
				</div>
				<div class="w-full">
					<h3 class="text-2xl font-bold mb-2">
						{t('pages.dashboard.recipe.browse-recipes.detail.instructions')}
					</h3>
					<ul class="list-disc">
						{#each $recipe.stepDetailResponses as instruction}
							<li class="text-sm">
								<span class="font-bold">
									{t('pages.dashboard.recipe.browse-recipes.detail.step', {
										step: instruction.numberStep
									})}
								</span>
								<br />
								{instruction.stepDescription}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
		<div class="w-1/4 text-right flex flex-col gap-2">
			<Button class="flex gap-4 justify-start" color="yellow"
				><ClockOutline />{t('pages.dashboard.recipe.browse-recipes.detail.changes-history')}</Button
			>
			<Button class="flex gap-4 justify-start"
				><EditOutline /> {t('pages.dashboard.recipe.browse-recipes.detail.edit')}</Button
			>
			<Button class="flex gap-4 justify-start" color="alternative"
				><CogOutline />{t('pages.dashboard.recipe.browse-recipes.detail.settings')}</Button
			>
		</div>
	</div>
{:else}
	<div class="w-full h-full flex justify-center items-center">
		<Spinner />
	</div>
{/if}
