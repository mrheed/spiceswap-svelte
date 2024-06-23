<script>
	import { page } from '$app/stores';
	import {
		getSettingsRecipeData,
		updateSettingsRecipeData
	} from '@spiceswap/api/recipe';
	import Dropzone from '@spiceswap/components/Dropzone.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
	convertToTitleCase,
		fileToBase64,
		generatePageTitleMeta,
		goToPrivateDetailRecipe,
		showToast,
	} from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, Input, Label, Spinner, Textarea } from 'flowbite-svelte';
	import { FloppyDiskOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const loading = writable(true);

	const name = writable('');
	const description = writable('');
	const visibility = writable('');
	const thumbnail = writable('');
  const recipeName = writable('');

	const fetchSettingsRecipeData = async () => {
		const response = await getSettingsRecipeData(recipeSlug);
		const data = await response.json();
		if (response.ok) {
			name.set(data.results.recipeName);
			description.set(data.results.about);
			visibility.set(data.results.visibility);
			thumbnail.set(data.results.thumbnailImageLink);
      recipeName.set(data.results.recipeName);
		} else {
			showToast(
				t('pages.dashboard.recipe.settings.errorTitle'),
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

	async function handleSaveUpdateRecipe() {
		await loadingStore.wrapFn(async () => {
			const putData = {
				recipeName: $name,
				about: $description,
				visibility: $visibility,
				thumbnailImage: await fileToBase64($thumbnail)
			};
			const response = await updateSettingsRecipeData(recipeSlug, putData);
			const data = await response.json();
			if (response.ok) {
				showToast(
					t('pages.dashboard.recipe.settings.update.success'),
					t('pages.dashboard.recipe.settings.update.success'),
					'success'
				);
				goToPrivateDetailRecipe(recipeSlug);
			} else {
				showToast(
					t('pages.dashboard.recipe.settings.update.error'),
					generateMessageFromResponse(data),
					'error'
				);
			}
		});
	}

	onMount(async () => {
		await loadingStore.wrapFn(fetchSettingsRecipeData);
	});

  $: console.log($thumbnail)
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.settings.title'))}
</svelte:head>

{#if !$loading}
	<div class="px-16 mt-8">
		<h1 class="font-bold">{t('pages.dashboard.recipe.settings.title')}</h1>

		<div class="mt-8 pt-8 px-8 bg-white rounded-lg py-8 shadow">
      <h2 class="text-xl font-bold mb-8">{convertToTitleCase($recipeName)}</h2>
      <hr class="border-t border-gray-200 my-8" />
			<div class="grid grid-cols-2 gap-16">
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.settings.information.name')}</Label>
						<Input type="text" bind:value={$name} on:input={(e) => handleInputChange(e, name)} />
					</div>
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.settings.information.description')}</Label>
						<Textarea
							bind:value={$description}
							on:input={(e) => handleInputChange(e, description)}
							rows="10"
						/>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.settings.information.visibility')}</Label>
						<ul
							class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						>
							<li
								class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
							>
								<div class="flex items-center ps-3">
									<input
										id="horizontal-list-radio-license"
										type="radio"
										value="public"
										name="visibility"
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
										bind:group={$visibility}
										on:change={(e) => handleInputChange(e, visibility)}
									/>
									<label
										for="horizontal-list-radio-license"
										class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>{t('pages.dashboard.recipe.settings.information.visibility.public')}
									</label>
								</div>
							</li>
							<li
								class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
							>
								<div class="flex items-center ps-3">
									<input
										id="horizontal-list-radio-id"
										type="radio"
										value="private"
										name="visibility"
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
										bind:group={$visibility}
										on:change={(e) => handleInputChange(e, visibility)}
									/>
									<label
										for="horizontal-list-radio-id"
										class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>{t('pages.dashboard.recipe.settings.information.visibility.private')}</label
									>
								</div>
							</li>
						</ul>
					</div>
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.settings.information.thumbnail')}</Label>
						<div class="flex items-center justify-center w-full">
							<Dropzone
								bind:image={$thumbnail}
								alt={t('pages.dashboard.recipe.settings.information.thumbnail')}
								formatDesc={t('pages.dashboard.recipe.settings.information.thumbnail.format')}
							/>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-t border-gray-200 my-8" />

			<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleSaveUpdateRecipe}>
				<FloppyDiskOutline />
				{t('pages.dashboard.recipe.settings.save')}</Button
			>
		</div>
	</div>
{:else}
	<div class="w-full h-full flex justify-center items-center mt-16">
		<Spinner />
	</div>
{/if}
