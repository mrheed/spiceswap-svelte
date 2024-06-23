<script>
	import { goto } from '$app/navigation';
	import {
		getModificationRequestRecipe,
		sendModificationRequest
	} from '@spiceswap/api/modification-request';
	import Alert from '@spiceswap/components/Alert.svelte';
	import Image from '@spiceswap/components/Image.svelte';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
		convertToIndonesianDate,
		convertToTitleCase,
		generatePageTitleMeta,
		goToPublicDetailRecipe,
		showToast
	} from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, Modal, Spinner, Textarea } from 'flowbite-svelte';
	import { CheckCircleOutline, LinkOutline, PaperPlaneOutline } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	const recipes = writable([]);
	const page = writable(0);
	const totalPages = writable(0);
	const isLoading = writable(true);
	const openModalSendMessage = writable(false);
	const message = writable('');
	const selectedRecipe = writable({});

	const fetchModificationRequestRecipe = async () => {
		isLoading.set(true);
		const response = await getModificationRequestRecipe($page);
		const data = await response.json();
		if (response.ok) {
			const recipesMapped = data.results.content.map((recipe) => ({
				...recipe,
				totalRating: recipe.totalRating ? recipe.totalRating : 0,
				recipeName: recipe.fromRecipeName,
				recipeSlug: recipe.fromRecipeSlug
			}));
			recipes.set(recipesMapped);
			totalPages.set(data.results.totalPages);
		} else {
			showToast(t('common.error'), generateMessageFromResponse(data), 'error');
		}
		isLoading.set(false);
	};

	const handlePageChange = (_pageNumber) => {
		page.set(_pageNumber - 1);
	};

	const getMyRecipeDetailLink = (recipe) => `/dashboard/recipe/my-recipes/${recipe.recipeSlug}`;

	const fetchSendModificationRequest = async () => {
		const response = await sendModificationRequest({
			fromRecipeSlug: $selectedRecipe.fromRecipeSlug,
			message: $message
		});
		const data = await response.json();
		if (response.ok) {
			showToast(
				t('pages.dashboard.modification-request.create.success-title'),
				generateMessageFromResponse(data),
				'success'
			);
			goto('/dashboard/modification-request');
		} else {
			showToast(
				t('pages.dashboard.modification-request.create.error-title'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	};

	const handleSendMessage = async () => {
		await loadingStore.wrapFn(fetchSendModificationRequest);
	};

	$: loadingStore.wrapFn(fetchModificationRequestRecipe);
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.modification-request.create'))}
</svelte:head>

<div class="my-8 px-48">
	<h1 class="font-bold">{t('pages.dashboard.modification-request.create.title')}</h1>
	{#if $isLoading}
		<div class="mt-8 flex justify-center items-center h-full w-full">
			<Spinner />
		</div>
	{/if}
	{#if $recipes.length === 0 && !$isLoading}
		<div class="mt-8 flex justify-center items-center h-full w-full">
			<Alert type="warning" dismissed={false} dismissible={false} alertClass="w-1/2 justify-center">
				<p class="text-gray-600">{t('common.no-data')}</p>
			</Alert>
		</div>
	{/if}
	<div class="grid grid-cols-3 mt-20 gap-x-4 gap-y-20">
		{#each $recipes as recipe}
			<div class="relative bg-white rounded-lg shadow-2xl">
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
					<a href={getMyRecipeDetailLink(recipe)} class="font-bold text-gray-600 text-title"
						>{convertToTitleCase(recipe.recipeName)}</a
					>
					<span class="text-gray-600 font-light text-sm"
						>{convertToIndonesianDate(recipe.createdAt)}</span
					>
				</div>
				<div class="flex gap-2 mt-auto w-full bottom-0 absolute px-8 py-4 items-center">
					<Button
						size="sm"
						class="flex gap-2"
            disabled={recipe.isWaiting}
						on:click={() => {
							openModalSendMessage.set(true);
							selectedRecipe.set(recipe);
						}}
						><CheckCircleOutline size="sm" />{t(
							'pages.dashboard.modification-request.create.button-select'
						)}</Button
					>
					<Button
						size="sm"
						color="gray"
						class="flex gap-2"
						on:click={() => {
							goToPublicDetailRecipe(recipe.recipeSlug);
						}}
						><LinkOutline size="sm" />{t(
							'pages.dashboard.modification-request.create.original-recipe'
						)}</Button
					>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex justify-center mt-8">
		<RecipePagination number={$page + 1} totalPages={$totalPages} onPageChange={handlePageChange} />
	</div>
</div>

<Modal size="sm" bind:open={$openModalSendMessage} on:close={() => openModalSendMessage.set(false)}>
	<div class="flex flex-col gap-4">
		<div class="flex justify-center gap-1 flex-col items-center mb-2">
			<h2 class="text-xl font-bold">
				{t('pages.dashboard.modification-request.create.message-title', {
					requestTo: $selectedRecipe.requestTo
				})}
			</h2>
			<p class="text-center text-sm">
				{t('pages.dashboard.modification-request.create.message-title-description', {
					fromRecipeName: $selectedRecipe.fromRecipeName,
					toRecipeName: $selectedRecipe.toRecipeName
				})}
			</p>
		</div>
		<div>
			<Textarea
				bind:value={$message}
				class="w-full"
				placeholder={t('pages.dashboard.modification-request.create.message-placeholder')}
				rows="5"
			/>
		</div>
		<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleSendMessage}>
			<PaperPlaneOutline size="sm" style="transform: rotate(90deg);" />
			{t('pages.dashboard.modification-request.create.send-message')}</Button
		>
	</div>
</Modal>
