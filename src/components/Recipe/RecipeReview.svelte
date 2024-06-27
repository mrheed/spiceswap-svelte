<script>
	import {
		browseReviewAuthenticated,
		browseReviews,
		deleteReview,
		getMyReview,
		writeReview
	} from '@spiceswap/api/review';
	import { MAX_RATING } from '@spiceswap/common/constant';
	import { t } from '@spiceswap/locale/i18n';
	import { authStore } from '@spiceswap/stores/authStore';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, Textarea } from 'flowbite-svelte';
	import { PaperPlaneOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { twMerge } from 'tailwind-merge';

	export let recipe = {};

	const rating = writable(0);
	const review = writable('');
	const myReview = writable({});
	const reviews = writable([]);
	const reviewPage = writable(0);
	const totalReviewPage = writable(0);
	const toggleFetchReviews = writable(false);
	const isReviewed = writable(false);
	const isOwnRecipe = writable(false);

	const setRating = (value) => {
		rating.set(value);
	};

	const fetchBrowseReviews = async () => {
		const response = await browseReviews(recipe.recipeSlug, $reviewPage);
		const data = await response.json();
		if (response.ok) {
			reviews.set(data.results.content);
			totalReviewPage.set(data.results.totalPages);
		}
	};

	const fetchBrowseReviewAuthenticated = async () => {
		const response = await browseReviewAuthenticated(recipe.recipeSlug, $reviewPage);
		const data = await response.json();
		if (response.ok) {
			reviews.set(data.results.content);
			totalReviewPage.set(data.results.totalPages);
		} else {
			reviews.set([]);
			totalReviewPage.set(0);
		}
	};

	const fetchMyReview = async () => {
		const response = await getMyReview(recipe.recipeSlug);
		const data = await response.json();
		if (response.ok) {
			myReview.set(data.results);
			review.set(data.results.comment);
			rating.set(data.results.rating);
			isReviewed.set(true);
		} else {
			myReview.set({});
			review.set('');
			rating.set(0);
			isReviewed.set(false);
		}
	};

	const fetchWriteReview = async () => {
		const response = await writeReview(recipe.recipeSlug, $rating, $review);
		const data = await response.json();
		if (response.ok) {
			showToast(
				t('common.recipe.review.success.title'),
				generateMessageFromResponse(data),
				'success'
			);
			toggleFetchReviews.set(true);
		} else {
			showToast(t('common.recipe.review.error.title'), generateMessageFromResponse(data), 'error');
		}
	};

	const fetchDeleteReview = async () => {
		const response = await deleteReview(recipe.recipeSlug);
		const data = await response.json();
		if (response.ok) {
			showToast(
				t('common.recipe.review.delete.success.title'),
				generateMessageFromResponse(data),
				'success'
			);
			toggleFetchReviews.set(true);
		} else {
			showToast(
				t('common.recipe.review.delete.error.title'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	};

	const handleOnClickWriteReview = async () => {
		await loadingStore.wrapFn(fetchWriteReview);
	};

	const handleOnClickDeleteReview = async () => {
		await loadingStore.wrapFn(fetchDeleteReview);
	};

	const getReviews = async () => {
		if ($authStore.isAuthenticated) {
			loadingStore.wrapFn(async () => {
				fetchBrowseReviewAuthenticated();
				fetchMyReview();
			});
		} else {
			loadingStore.wrapFn(fetchBrowseReviews);
		}
	};

	onMount(async () => {
		getReviews();
		isOwnRecipe.set(recipe.owner === $authStore.user.username);
	});

	$: if ($toggleFetchReviews) {
		getReviews();
		toggleFetchReviews.set(false);
	}
</script>

<div class="flex flex-col gap-4">
	{#if !$isOwnRecipe && $authStore.isAuthenticated}
		<Textarea
			class="bg-white"
			bind:value={$review}
			placeholder={t('common.recipe.review.placeholder')}
			rows="4"
		/>
		<div class="flex gap-8 justify-end">
			<div class="flex gap-2 items-center">
				<span class="font-semibold">
					{t('common.recipe.review.rating')}
				</span>
				<div class="flex gap-1">
					{#each Array(MAX_RATING) as _, i (i)}
						<svg
							class={twMerge(
								'w-4 h-4 cursor-pointer',
								i < $rating ? 'text-yellow-500' : 'text-gray-300'
							)}
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 22 20"
							on:click={() => setRating(i + 1)}
						>
							<path
								d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
							/>
						</svg>
					{/each}
				</div>
			</div>
			<div class="flex gap-2">
				{#if $isReviewed}
					<Button
						on:click={() => handleOnClickDeleteReview()}
						class="flex gap-2 items-center"
						color="none"
					>
						<TrashBinOutline size="sm" />
						{t('common.recipe.review.button.delete')}
					</Button>
				{/if}
				<Button on:click={() => handleOnClickWriteReview()} class="flex gap-2 items-center">
					<PaperPlaneOutline style="transform: rotate(90deg);" size="sm" />
					{#if $isReviewed}
						{t('common.recipe.review.button.edit')}
					{:else}
						{t('common.recipe.review.button')}
					{/if}
				</Button>
			</div>
		</div>
	{/if}

	<hr />
	<h2 class="text-2xl mb-2 font-bold">{t('common.recipe.review.title')}</h2>
	{#if $reviews.length == 0}
		<p class="text-gray-500 dark:text-gray-400">{t('common.recipe.review.no-review')}</p>
	{/if}
	{#each $reviews as review}
		<div class="flex items-center mb-2">
			<div class="font-medium dark:text-white">
				<p>{review.username}</p>
			</div>
		</div>
		<div class="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
			{#each Array(MAX_RATING) as _, i (i)}
				<svg
					class={twMerge(
						'w-4 h-4 cursor-pointer',
						i < review.rating ? 'text-yellow-500' : 'text-gray-300'
					)}
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 22 20"
				>
					<path
						d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
					/>
				</svg>
			{/each}
		</div>
		<p class="mb-2 text-gray-500 dark:text-gray-400">
			{review.comment}
		</p>
	{/each}
</div>
