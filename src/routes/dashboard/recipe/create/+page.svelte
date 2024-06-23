<!-- Start of Selection -->
<script>
	import { saveRecipe } from '@spiceswap/api/recipe';
	import { SCENES } from '@spiceswap/common/constant';
	import Dropzone from '@spiceswap/components/Dropzone.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import { fileToBase64, generatePageTitleMeta, goToPrivateDetailRecipe, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, Input, Label, Modal, Radio, RadioButton, Textarea } from 'flowbite-svelte';
	import { FloppyDiskOutline, PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const name = writable('');
	const description = writable('');
	const visibility = writable('public');
	const thumbnail = writable(null);
	const portion = writable('');
	const ingredients = writable([]);
	const steps = writable([]);

	onMount(() => {
		pageStore.setScene(SCENES.CREATE_RECIPE);
	});

	function handleInputChange(event, store, key = null) {
		if (key) {
			store.update((currentValues) => ({ ...currentValues, [key]: event.target.value }));
		} else {
			store.set(event.target.value);
		}
	}

	function handleAddIngredient(event) {
		ingredients.update((ingredients) => [
			...ingredients,
			{ name: '', amount: '', ingredientDetailSlug: '' }
		]);
	}

	function handleDeleteIngredient(index) {
		ingredients.set($ingredients.filter((_, i) => i !== index));
	}

	function handleDeleteStep(index) {
		steps.set($steps.filter((_, i) => i !== index));
	}

	function handleAddStep() {
		steps.update((steps) => [...steps, { description: '' }]);
	}

	async function handleSaveRecipe() {
		const recipeData = {
			recipeName: $name,
			about: $description,
			thumbnailImage: $thumbnail ? await fileToBase64($thumbnail) : '',
			portion: $portion,
			visibility: $visibility,
			ingredientDetailRequests: $ingredients.map((ingredient) => ({
				ingredientName: ingredient.name,
				dose: ingredient.amount
			})),
			stepRequests: $steps.map((step) => ({
				stepDescription: step.description
			}))
		};

		await loadingStore.wrapFn(async () => {
			const response = await saveRecipe(recipeData);
			const data = await response.json();
			if (response.ok) {
				showToast(t('pages.dashboard.recipe.create.save.success.title'), data.message, 'success');
        goToPrivateDetailRecipe(data.results.recipeSlug);
			} else {
				showToast(
					t('pages.dashboard.recipe.create.save.error.title'),
					generateMessageFromResponse(data),
					'error'
				);
			}
		});
	}
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.create.title'))}
</svelte:head>

<div class="px-32 mt-8">
	<h1 class="text-4xl font-bold">{t('pages.dashboard.recipe.create.title')}</h1>
	<div class="px-8 py-4 mt-8 bg-white rounded-lg">
		<div class="bg-white">
			<h2 class="font-bold text-lg">{t('pages.dashboard.recipe.create.information.title')}</h2>
			<div class="grid grid-cols-2 gap-16 mt-4">
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.create.information.name')}</Label>
						<Input type="text" bind:value={$name} on:input={(e) => handleInputChange(e, name)} />
					</div>
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.create.information.description')}</Label>
						<Textarea
							bind:value={$description}
							on:input={(e) => handleInputChange(e, description)}
						/>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.create.information.visibility')}</Label>
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
										>{t('pages.dashboard.recipe.create.information.visibility.public')}
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
										>{t('pages.dashboard.recipe.create.information.visibility.private')}</label
									>
								</div>
							</li>
						</ul>
					</div>
					<div class="flex flex-col gap-1">
						<Label>{t('pages.dashboard.recipe.create.information.thumbnail')}</Label>
						<div class="flex items-center justify-center w-full">
							<Dropzone
								bind:image={$thumbnail}
								alt={t('pages.dashboard.recipe.create.information.thumbnail')}
								formatDesc={t('pages.dashboard.recipe.create.information.thumbnail.format')}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<hr class="border-t border-gray-200 my-8" />
		<div class="mt-4">
			<h2 class="font-bold text-lg px-6">{t('pages.dashboard.recipe.create.detail.title')}</h2>
			<div class="grid grid-cols-2 gap-x-16 gap-y-8 mt-4">
				<div class="flex flex-col gap-1 px-6">
					<Label>{t('pages.dashboard.recipe.create.detail.portion')}</Label>
					<Input bind:value={$portion} on:input={(e) => handleInputChange(e, portion)} class="w-1/2"/>
				</div>
				<div></div>
				<div class="flex flex-col gap-1">
					<div class="w-full">
						{#if $ingredients.length > 0}
							<div class="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
								<table
									class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
								>
									<thead
										class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
									>
										<tr>
											<th class="px-6 py-3"
												>{t('pages.dashboard.recipe.create.ingredients.add.name')}</th
											>
											<th class="px-6 py-3"
												>{t('pages.dashboard.recipe.create.ingredients.add.amount')}</th
											>
											<th class="px-6 py-3" width="1%"
												>{t('pages.dashboard.recipe.create.ingredients.add.actions')}</th
											>
										</tr>
									</thead>
									{#each $ingredients as ingredient, index}
										<tr>
											<td class="px-6 py-3">
												<Input
													bind:value={ingredient.name}
												/>
											</td>
											<td class="px-6 py-3">
												<Input
													bind:value={ingredient.amount}
												/>
											</td>
											<td class="px-6 py-3">
												<Button
													class="p-2 text-xs rounded-md text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-9000"
													on:click={() => handleDeleteIngredient(index)}
												>
													<TrashBinOutline size="sm" />
												</Button>
											</td>
										</tr>
									{/each}
								</table>
							</div>
						{/if}
						<Button
							class="mt-4 flex gap-2 text-sm px-3 mx-6"
							size="sm"
							on:click={handleAddIngredient}
						>
							<PlusOutline size="sm" />
							{t('pages.dashboard.recipe.create.ingredients.add')}</Button
						>
					</div>
				</div>
				<div class="flex flex-col gap-1">
					<div class="w-full">
						{#if $steps.length > 0}
							<div class="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
								<table
									class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
								>
									<thead
										class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
									>
										<tr>
											<th class="px-6 py-3">{t('pages.dashboard.recipe.create.steps.title')}</th>
											<th class="px-6 py-3" width="1%">{t('pages.dashboard.recipe.create.steps.actions')}</th>
										</tr>
									</thead>
									{#each $steps as step, index}
										<tr>
											<td class="px-6 py-3 flex flex-col gap-2">
												<Label class="font-bold"
													>{t('pages.dashboard.recipe.create.steps.step', {
														step: index + 1
													})}</Label
												>
												<Textarea
													bind:value={step.description}
												/>
											</td>
											<td class="px-6 py-3">
												<Button
													class="p-2 text-xs rounded-md text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-9000"
													on:click={() => handleDeleteStep(index)}
												>
													<TrashBinOutline size="sm" />
												</Button>
											</td>
										</tr>
									{/each}
								</table>
							</div>
						{/if}
						<Button
							class="mt-4 flex gap-2 text-sm px-3 mx-6"
							size="sm"
							on:click={handleAddStep}
						>
							<PlusOutline size="sm" />
							{t('pages.dashboard.recipe.create.steps.add')}</Button
						>
					</div>
				</div>
			</div>
		</div>

		<hr class="border-t border-gray-200 my-8" />

		<Button class="mt-4 flex gap-2 text-sm px-4 mx-6" on:click={handleSaveRecipe}>
			<FloppyDiskOutline />
			{t('pages.dashboard.recipe.create.save')}</Button
		>
	</div>
</div>
<!-- End of Selection -->
