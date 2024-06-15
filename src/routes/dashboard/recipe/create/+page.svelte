<!-- Start of Selection -->
<script>
	import { saveRecipe } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import { generatePageTitleMeta } from '@spiceswap/utils/common';
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

	const addStepsModalOpen = writable(false);
	const addIngredientsModalOpen = writable(false);

	const ingredientDetails = writable({
		id: '',
		name: '',
		amount: '',
		unit: ''
	});
	const stepDetails = writable({
		description: ''
	});

	onMount(() => {
		pageStore.set({
			scene: 'create_recipe'
		});
	});

	function handleInputChange(event, store, key = null) {
		if (key) {
			store.update((currentValues) => ({ ...currentValues, [key]: event.target.value }));
		} else {
			store.set(event.target.value);
		}
	}

	function handleFileChange(event) {
		thumbnail.set(event.target.files[0]);
	}

	function handleAddIngredient(event) {
		ingredients.set([...$ingredients, { ...$ingredientDetails, id: Date.now() }]);
		addIngredientsModalOpen.set(false);
		ingredientDetails.set({
			name: '',
			amount: 0,
			unit: ''
		});
	}

	function handleDeleteIngredient(ingredient) {
		ingredients.set($ingredients.filter((i) => i.id !== ingredient.id));
	}

	function handleDeleteStep(index) {
		steps.set($steps.filter((_, i) => i !== index));
	}

	function handleAddStep() {
		steps.set([...$steps, { ...$stepDetails, id: Date.now() }]);
		addStepsModalOpen.set(false);
		stepDetails.set({
			description: ''
		});
	}

	async function handleSaveRecipe() {
		const recipeData = {
			recipeName: $name,
			about: $description,
			thumbnailImage: $thumbnail,
			portion: $portion,
			visibility: $visibility,
			ingredientDetailRequests: $ingredients.map((ingredient) => ({
				ingredientName: ingredient.name,
				dose: `${ingredient.amount} ${ingredient.unit}`
			})),
			stepRequests: $steps.map((step) => ({
				stepDescription: step.description
			}))
		};

		try {
			loadingStore.setLoading(true);
			const response = await saveRecipe(recipeData);
			const json = await response.json();
			if (response.ok) {
				console.log(json);
			} else {
				console.error(json);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loadingStore.setLoading(false);
		}
	}
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.create.title'))}
</svelte:head>

<div class="px-48 mt-8">
	<h1 class="text-2xl font-bold">{t('pages.dashboard.recipe.create.title')}</h1>
	<div class="mt-4">
		<h2 class="font-bold text-lg">{t('pages.dashboard.recipe.create.information.title')}</h2>
		<div class="grid grid-cols-2 gap-16 mt-4">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<Label>{t('pages.dashboard.recipe.create.information.name')}</Label>
					<Input type="text" bind:value={$name} on:input={(e) => handleInputChange(e, name)} />
				</div>
				<div class="flex flex-col gap-1">
					<Label>{t('pages.dashboard.recipe.create.information.description')}</Label>
					<Textarea bind:value={$description} on:input={(e) => handleInputChange(e, description)} />
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
						<label
							for="dropzone-file"
							class="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							{#if $thumbnail}
								<img
									src={URL.createObjectURL($thumbnail)}
									alt="Thumbnail Preview"
									class="rounded-lg h-full"
								/>
							{:else}
								<div class="flex flex-col items-center justify-center">
									<svg
										class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 16"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
										/>
									</svg>
									<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
										{@html t('pages.dashboard.recipe.create.information.thumbnail.upload')}
									</p>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										{t('pages.dashboard.recipe.create.information.thumbnail.format')}
									</p>
								</div>
							{/if}
							<input id="dropzone-file" type="file" class="hidden" on:change={handleFileChange} />
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
	<hr class="border-t border-gray-200 my-8" />
	<div class="mt-4">
		<h2 class="font-bold text-lg">{t('pages.dashboard.recipe.create.detail.title')}</h2>
		<div class="grid grid-cols-2 gap-x-16 gap-y-8 mt-4">
			<div class="flex flex-col gap-1">
				<Label>{t('pages.dashboard.recipe.create.detail.portion')}</Label>
				<Input bind:value={$portion} on:input={(e) => handleInputChange(e, portion)} />
			</div>
			<div></div>
			<div class="flex flex-col gap-1">
				<Label>{t('pages.dashboard.recipe.create.ingredients.title')}</Label>
				<div class="w-full">
					{#if $ingredients.length > 0}
						<div class="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
							<div class="mb-2 flex gap-2 text-sm text-gray-700 dark:text-gray-400">
								<div class="w-1/3">{t('pages.dashboard.recipe.create.ingredients.add.name')}</div>
								<div class="w-1/3">
									{t('pages.dashboard.recipe.create.ingredients.add.amount')}
								</div>
							</div>
							{#each $ingredients as ingredient}
								<div class="flex gap-2 rounded-lg mb-2">
									<div class="flex py-2 px-4 w-1/3 rounded-lg bg-gray-100 dark:bg-gray-700">
										{ingredient.name}
									</div>
									<div class="flex py-2 px-4 w-1/3 rounded-lg bg-gray-100 dark:bg-gray-700">
										{ingredient.amount}
										{ingredient.unit}
									</div>
									<div class="px-4 w-1/3">
										<Button
											class="px-3 py-2 text-xs rounded-md text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
											on:click={() => handleDeleteIngredient(ingredient)}
										>
											<TrashBinOutline />
										</Button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
					<Button
						class="mt-4 flex gap-2 text-sm px-4"
						on:click={() => addIngredientsModalOpen.set(true)}
					>
						<PlusOutline />
						{t('pages.dashboard.recipe.create.ingredients.add')}</Button
					>
				</div>
			</div>
			<div class="flex flex-col gap-1">
				<Label>{t('pages.dashboard.recipe.create.steps.title')}</Label>
				<div class="w-full">
					{#if $steps.length > 0}
						<div class="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
							{#each $steps as step, index}
								<Label class="mb-1"
									>{t('pages.dashboard.recipe.create.steps.step', { step: index + 1 })}</Label
								>
								<div class="flex rounded-lg mb-2">
									<div class="flex py-2 px-4 w-2/3 rounded-lg bg-gray-100 dark:bg-gray-700">
										{step.description}
									</div>
									<div class="px-4 w-1/3">
										<Button
											class="px-3 py-2 text-xs rounded-md text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
											on:click={() => handleDeleteStep(index)}
										>
											<TrashBinOutline />
										</Button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
					<Button class="mt-4 flex gap-2 text-sm px-4" on:click={() => addStepsModalOpen.set(true)}>
						<PlusOutline />
						{t('pages.dashboard.recipe.create.steps.add')}</Button
					>
				</div>
			</div>
		</div>
	</div>

	<hr class="border-t border-gray-200 my-8" />

	<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleSaveRecipe}>
		<FloppyDiskOutline />
		{t('pages.dashboard.recipe.create.save')}</Button
	>
</div>
<!-- End of Selection -->

<Modal
	title={t('pages.dashboard.recipe.create.ingredients.add')}
	size="sm"
	bind:open={$addIngredientsModalOpen}
	on:close={() => addIngredientsModalOpen.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.recipe.create.ingredients.add.name')}</Label>
			<Input
				bind:value={$ingredientDetails.name}
				on:input={(e) => handleInputChange(e, ingredientDetails, 'name')}
			/>
		</div>
		<div class="flex gap-2">
			<div class="flex flex-col gap-2">
				<Label>{t('pages.dashboard.recipe.create.ingredients.add.amount')}</Label>
				<Input
					bind:value={$ingredientDetails.amount}
					on:input={(e) => handleInputChange(e, ingredientDetails, 'amount')}
					type="number"
				/>
			</div>
			<div class="flex flex-col gap-2 w-full">
				<Label>{t('pages.dashboard.recipe.create.ingredients.add.unit')}</Label>
				<Input
					bind:value={$ingredientDetails.unit}
					on:input={(e) => handleInputChange(e, ingredientDetails, 'unit')}
				/>
			</div>
		</div>
		<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleAddIngredient}>
			<FloppyDiskOutline />
			{t('pages.dashboard.recipe.create.ingredients.add')}</Button
		>
	</div>
</Modal>

<Modal
	title={t('pages.dashboard.recipe.create.steps.add')}
	size="sm"
	bind:open={$addStepsModalOpen}
	on:close={() => addStepsModalOpen.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.recipe.create.steps.description')}</Label>
			<Textarea
				bind:value={$stepDetails.description}
				on:input={(e) => handleInputChange(e, stepDetails, 'description')}
			/>
		</div>
		<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleAddStep}>
			<FloppyDiskOutline />
			{t('pages.dashboard.recipe.create.steps.add')}</Button
		>
	</div>
</Modal>
