<script>
	import { getHomeIngredients } from '@spiceswap/api/ingredient';
	import { getPopularRecipes } from '@spiceswap/api/recipe';
	import { SCENES } from '@spiceswap/common/constant';
	import Image from '@spiceswap/components/Image.svelte';
	import Navbar from '@spiceswap/components/Navbar.svelte';
	import RecipeGrid from '@spiceswap/components/Recipe/RecipeGrid.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import { convertToTitleCase, generatePageTitleMeta } from '@spiceswap/utils/common';
	import { Spinner } from 'flowbite-svelte';
	import { AngleRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const ingredients = writable([]);
	const popularRecipes = writable([]);
	const isPopularRecipeLoading = writable(true);
	const isIngredientLoading = writable(true);

	const fetchPopularRecipes = async () => {
		isPopularRecipeLoading.set(true);
		const response = await getPopularRecipes();
		const data = await response.json();
		if (response.ok) {
			popularRecipes.set(data.results);
		}
		isPopularRecipeLoading.set(false);
	};

	const fetchIngredients = async () => {
		isIngredientLoading.set(true);
		const response = await getHomeIngredients();
		const data = await response.json();
		if (response.ok) {
			ingredients.set(data.results);
		}
		isIngredientLoading.set(false);
	};

	onMount(async () => {
		await loadingStore.wrapFn(async () => {
			await fetchIngredients();
			await fetchPopularRecipes();
		});
		pageStore.setScene(SCENES.HOME);
	});
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.home.title'))}
</svelte:head>

<div class="relative">
	<Navbar />
</div>
<div class="bg-white text-gray-600 work-sans leading-normal text-base tracking-normal pt-32">
	<section
		class="w-full mx-auto bg-nordic-gray-light flex pt-12 md:pt-0 md:items-center bg-cover bg-right relative"
		style="max-width:1600px; height: 32rem;"
	>
		<div class="container mx-auto" style="z-index: 99;">
			<div
				class="flex flex-col gap-2 justify-center items-start py-8 px-16 tracking-wide bg-black bg-opacity-50"
			>
				<h1 class="text-black text-4xl text-white font-semibold">{t('hero.title')}</h1>
				<p class="text-white opacity-90 text-sm font-light">{t('hero.subtitle')}</p>
			</div>
		</div>
		<Image
			props={{
				src: '/hero.jpg',
				class: 'w-full h-full object-cover absolute top-0 left-0'
			}}
		/>
	</section>

	<section class="bg-white py-8">
		<div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
			<nav id="store" class="w-full z-30 top-0 px-6 py-1">
				<div
					class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3"
				>
					<h1 class="font-bold text-gray-800 text-xl">
						{t('pages.home.ingredients.title')}
					</h1>

					<a href="#" class="text-gray-800 font-light flex items-center gap-1">
						{t('pages.home.more')}
						<AngleRightOutline size="sm" />
					</a>
				</div>
			</nav>

			{#if $isIngredientLoading}
				<div class="mt-8 flex justify-center items-center h-full w-full">
					<Spinner />
				</div>
			{:else}
				{#each $ingredients as ingredient, i (i)}
					<div class="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col">
						<a href="/browse/recipes?keyword={ingredient.ingredientName}">
							<Image
								props={{
									src: ingredient.imageLink,
									alt: ingredient.ingredientName,
									class: 'hover:grow hover:shadow-lg'
								}}
							/>
							<div class="pt-3 flex items-center justify-between">
								<p class="">{convertToTitleCase(ingredient.ingredientName)}</p>
							</div>
						</a>
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<section class="bg-white py-8">
		<div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
			<nav id="store" class="w-full z-30 top-0 px-6 py-1">
				<div
					class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3"
				>
					<h1 class="font-bold text-gray-800 text-xl">
						{t('pages.home.popular.title')}
					</h1>

					<a href="/browse/recipes" class="text-gray-800 font-light flex items-center gap-1">
						{t('pages.home.more')}
						<AngleRightOutline size="sm" />
					</a>
				</div>
			</nav>

			<RecipeGrid recipes={$popularRecipes} isLoading={$isPopularRecipeLoading} gridCount={4} />
		</div>
	</section>

	<section class="bg-white py-8">
		<div class="container py-8 px-6 mx-auto">
			<a
				class="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl mb-8"
				href="#"
			>
				{t('pages.home.about.title')}
			</a>
			<p class="mt-8 mb-8">
				{t('pages.home.about.content')}
			</p>
		</div>
	</section>
</div>
