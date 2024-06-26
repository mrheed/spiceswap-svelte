<script>
	import { getHomeIngredients } from '@spiceswap/api/ingredient';
	import { SCENES } from '@spiceswap/common/constant';
	import Image from '@spiceswap/components/Image.svelte';
	import Navbar from '@spiceswap/components/Navbar.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import { convertToTitleCase, generatePageTitleMeta } from '@spiceswap/utils/common';
	import { AngleRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const ingredients = writable([]);

	const products = [
		{
			name: 'Product 1',
			image:
				'https://images.unsplash.com/photo-1555982105-d25af4182e4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80',
			price: '£9.99'
		}
	];

	const fetchIngredients = async () => {
		const response = await getHomeIngredients();
		const data = await response.json();
		if (response.ok) {
			ingredients.set(data.results);
		}
	};

	onMount(async () => {
		await loadingStore.wrapFn(fetchIngredients);
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
		</div>
	</section>

	<section class="bg-white py-8">
		<div class="container py-8 px-6 mx-auto">
			<a
				class="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl mb-8"
				href="#"
			>
				About
			</a>

			<p class="mt-8 mb-8">
				This template is inspired by the stunning nordic minimalist design - in particular:
				<br />
				<a
					class="text-gray-800 underline hover:text-gray-900"
					href="http://savoy.nordicmade.com/"
					target="_blank">Savoy Theme</a
				>
				created by
				<a class="text-gray-800 underline hover:text-gray-900" href="https://nordicmade.com/"
					>https://nordicmade.com/</a
				>
				and
				<a
					class="text-gray-800 underline hover:text-gray-900"
					href="https://www.metricdesign.no/"
					target="_blank">https://www.metricdesign.no/</a
				>
			</p>

			<p class="mb-8">
				Lorem ipsum dolor sit amet, consectetur <a href="#">random link</a> adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Vel risus commodo viverra maecenas accumsan
				lacus vel facilisis volutpat. Vitae aliquet nec ullamcorper sit. Nullam eget felis eget nunc
				lobortis mattis aliquam. In est ante in nibh mauris. Egestas congue quisque egestas diam in.
				Facilisi nullam vehicula ipsum a arcu. Nec nam aliquam sem et tortor consequat. Eget mi proin
				sed libero enim sed faucibus turpis in. Hac habitasse platea dictumst quisque. In aliquam sem
				fringilla ut. Gravida rutrum quisque non tellus orci ac auctor augue mauris. Accumsan lacus vel
				facilisis volutpat est velit egestas dui id. At tempor commodo ullamcorper a. Volutpat commodo
				sed egestas egestas fringilla. Vitae congue eu consequat ac.
			</p>
		</div>
	</section>
</div>

<style>
	.work-sans {
		font-family: 'Work Sans', sans-serif;
	}

	#menu-toggle:checked + [id^='menu-'],
	#menu-toggle:checked + .menu-item {
		display: block;
	}

	.carousel-open:checked + .carousel-item {
		position: static;
		opacity: 100;
	}

	.carousel-item {
		-webkit-transition: opacity 0.6s ease-out;
		transition: opacity 0.6s ease-out;
	}

	#carousel-1:checked ~ .control-1,
	#carousel-2:checked ~ .control-2,
	#carousel-3:checked ~ .control-3 {
		display: block;
	}

	.carousel-indicators {
		list-style: none;
		margin: 0;
		padding: 0;
		position: absolute;
		bottom: 2%;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 10;
	}

	#carousel-1:checked ~ .control-1 ~ .carousel-indicators li:nth-child(1) .carousel-bullet,
	#carousel-2:checked ~ .control-2 ~ .carousel-indicators li:nth-child(2) .carousel-bullet,
	#carousel-3:checked ~ .control-3 ~ .carousel-indicators li:nth-child(3) .carousel-bullet {
		color: #000;
		/*Set to match the Tailwind colour you want the active one to be */
	}
</style>
