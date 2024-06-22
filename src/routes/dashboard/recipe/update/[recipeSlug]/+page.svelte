<script>
	import { page } from '$app/stores';
	import { getUpdateRecipeData, updateDetailRecipeData } from '@spiceswap/api/recipe';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { generatePageTitleMeta, goToPrivateDetailRecipe, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Modal, Button, Input, Label, Spinner, Textarea } from 'flowbite-svelte';
	import { FloppyDiskOutline, PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const recipeSlug = $page.params.recipeSlug;
	const loading = writable(true);
	const ingredients = writable([]);
	const steps = writable([]);
	const portion = writable(0);

	const fetchUpdateRecipeData = async () => {
		const response = await getUpdateRecipeData(recipeSlug);
		const data = await response.json();
		if (response.ok) {
			const formattedIngredients = data.results.updateIngredientDetailResponses.map(
				(ingredient) => ({
					ingredientName: ingredient.ingredientName,
					amount: ingredient.dose,
					ingredientDetailSlug: ingredient.ingredientDetailSlug
				})
			);
			ingredients.set(formattedIngredients);
			const formattedSteps = data.results.updateStepResponses.map((step) => ({
				stepDescription: step.stepDescription,
				stepSlug: step.stepSlug
			}));
			steps.set(formattedSteps);
			portion.set(data.results.portion);
		} else {
			showToast(
				t('pages.dashboard.recipe.update.errorTitle'),
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

	function handleDeleteIngredient(ingredient) {
		ingredients.update((ingredients) => ingredients.filter((i) => i !== ingredient));
	}

	function handleDeleteStep(index) {
		steps.update((steps) => steps.filter((_, i) => i !== index));
	}

	function handleAddIngredient() {
    const newIngredient = {
      ingredientName: '',
      amount: '',
      unit: '',
      ingredientDetailSlug: null
    }
		ingredients.update((ingredients) => [...ingredients, newIngredient]);
	}

	function handleAddStep() {
    const newStep = {
      stepDescription: '',
      stepSlug: null
    }
		steps.update((steps) => [...steps, newStep]);
	}

	async function handleSaveUpdateRecipe() {
    await loadingStore.wrapFn(async () => {
      const response = await updateDetailRecipeData(recipeSlug, {
        portion: $portion,
        ingredientDetailRequests: $ingredients.map(ingredient => ({
          ingredientDetailSlug: ingredient.ingredientDetailSlug,
          ingredientName: ingredient.ingredientName,
          dose: ingredient.amount
        })),
        stepRequests: $steps.map(step => ({
          stepSlug: step.stepSlug,
          stepDescription: step.stepDescription
        }))
      })
      const data = await response.json();
      if (response.ok) {
        showToast(
          t('pages.dashboard.recipe.update.successTitle'),
          generateMessageFromResponse(data),
          'success'
        );
        goToPrivateDetailRecipe(recipeSlug);
      } else {
        showToast(
          t('pages.dashboard.recipe.update.errorTitle'),
          generateMessageFromResponse(data),
          'error'
        );
      }
    })
  }

	onMount(async () => {
		await loadingStore.wrapFn(fetchUpdateRecipeData);
	});
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.recipe.update.title'))}
</svelte:head>

{#if !$loading}
	<div class="px-16 mt-8">
		<h1 class="font-bold px-6">{t('pages.dashboard.recipe.update.title')}</h1>

		<div class="mt-8 pt-8 px-8 bg-white rounded-lg py-8 shadow">
			<div class="grid grid-cols-2 gap-x-16 gap-y-8 mt-4">
				<div class="flex flex-col gap-1 px-6">
					<Label>{t('pages.dashboard.recipe.update.detail.portion')}</Label>
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
												>{t('pages.dashboard.recipe.update.ingredients.add.name')}</th
											>
											<th class="px-6 py-3"
												>{t('pages.dashboard.recipe.update.ingredients.add.amount')}</th
											>
											<th class="px-6 py-3" width="1%"
												>{t('pages.dashboard.recipe.update.ingredients.add.actions')}</th
											>
										</tr>
									</thead>
									{#each $ingredients as ingredient}
										<tr>
											<td class="px-6 py-3">
                        <Input
                          bind:value={ingredient.ingredientName}
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
													on:click={() => handleDeleteIngredient(ingredient)}
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
							on:click={() => handleAddIngredient()}
						>
							<PlusOutline size="sm" />
							{t('pages.dashboard.recipe.update.ingredients.add')}</Button
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
											<th class="px-6 py-3">{t('pages.dashboard.recipe.update.steps.title')}</th>
											<th class="px-6 py-3" width="1%">{t('pages.dashboard.recipe.update.steps.actions')}</th>
										</tr>
									</thead>
									{#each $steps as step, index}
										<tr>
											<td class="px-6 py-3 flex flex-col gap-2">
												<Label class="font-bold"
													>{t('pages.dashboard.recipe.update.steps.step', {
														step: index + 1
													})}</Label
												>
												<Textarea
													bind:value={step.stepDescription}
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
							on:click={() => handleAddStep()}
						>
							<PlusOutline size="sm" />
							{t('pages.dashboard.recipe.update.steps.add')}</Button
						>
					</div>
				</div>
			</div>

			<hr class="border-t border-gray-200 my-8" />

			<Button class="mt-4 flex gap-2 text-sm px-4 mx-6" on:click={handleSaveUpdateRecipe}>
				<FloppyDiskOutline />
				{t('pages.dashboard.recipe.update.save')}</Button
			>
		</div>
	</div>
{:else}
	<div class="w-full h-full flex justify-center items-center mt-16">
		<Spinner />
	</div>
{/if}
