<script>
	import { StarOutline, StarSolid } from 'flowbite-svelte-icons';
	import Image from '../Image.svelte';
	import Bookmark from './Bookmark.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { convertToIndonesianDate, convertToTitleCase } from '@spiceswap/utils/common';
	import Alert from '../Alert.svelte';
	import { Spinner } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { authStore } from '@spiceswap/stores/authStore';

	export let recipes = [];
	export let withBookmark = true;
	export let gridCount = 4;
  export let isLoading = false;
	export let detailLink = (recipe) => `browse/recipes/${recipe.recipeSlug}`;

  const isAuthenticated = writable(false)
  $: isAuthenticated.set($authStore.isAuthenticated)
</script>

{#if isLoading}
  <div class="mt-8 flex justify-center items-center h-full w-full">
    <Spinner />
  </div>
{/if}
{#if recipes.length === 0 && !isLoading}
	<div class="mt-8 flex justify-center items-center h-full w-full">
		<Alert type="warning" dismissed={false} dismissible={false} alertClass="w-full justify-center">
			<p class="text-gray-600">{t('common.no-recipes')}</p>
		</Alert>
	</div>
{/if}
<div class="grid grid-cols-{gridCount} mt-20 gap-x-4 gap-y-20">
	{#each recipes as recipe}
		<div class="relative bg-white rounded-lg shadow">
			<div class="h-72 relative hover:grow flex items-center justify-center">
				<Image
					props={{
						src: recipe.thumbnailImageLink,
						alt: recipe.recipeName,
						class: 'w-full h-full object-center shadow-2xl object-cover'
					}}
					outerClass="h-5/6 w-11/12 -translate-y-16 rounded-lg overflow-hidden"
				/>
			</div>
			<div class="flex flex-col justify-between pb-4 px-8 gap-2 -translate-y-16">
				<a href={detailLink(recipe)} class="font-bold text-gray-600 text-title"
					>{convertToTitleCase(recipe.recipeName)}</a
				>
				<span class="text-gray-600 font-light text-sm"
					>{convertToIndonesianDate(recipe.createdAt)}</span
				>
				<span class="italic font-light text-sm">
					{t('common.review', { count: recipe.totalReviewers })}
				</span>
			</div>
			<div
				class="flex gap-2 justify-between mt-auto w-full bottom-0 absolute px-8 py-4 items-center"
			>
				<i class="text-yellow-400 flex">
					{#each Array(5).fill() as _, i}
						{#if i + 1 <= recipe.totalRating}
							<StarSolid />
						{:else}
							<StarOutline />
						{/if}
					{/each}
				</i>
				{#if withBookmark && $isAuthenticated}
					<Bookmark {recipe} />
				{/if}
			</div>
		</div>
	{/each}
</div>
