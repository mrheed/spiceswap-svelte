<script>
	import {
		addIngredient,
		deleteIngredient,
		getIngredients,
		updateIngredient
	} from '@spiceswap/api/ingredient';
	import Dropzone from '@spiceswap/components/Dropzone.svelte';
	import TablePagination from '@spiceswap/components/Table/TablePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
		convertToIndonesianDate,
		convertToTitleCase,
		fileToBase64,
		showToast,
		urlToFile
	} from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Modal, Button, DropdownItem, Search, Dropdown, Label, Input } from 'flowbite-svelte';
	import { FloppyDiskOutline } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	import _ from 'lodash';
	import ModalDelete from '@spiceswap/components/Modal/ModalDelete.svelte';
	import Image from '@spiceswap/components/Image.svelte';

	const toggleFetch = writable(false);
	const keyword = writable('');
	const ingredients = writable([]);
	const pageNumber = writable(1);
	const paginationData = writable({
		totalPages: 1,
		pageSize: 10,
		totalData: 0
	});

	const ingredientAdd = writable({});
	const ingredientEdit = writable({});
	const ingredientDelete = writable({});
	const ingredientShow = writable({});

	const openModalAddIngredient = writable(false);
	const openModalEditIngredient = writable(false);
	const openModalDeleteIngredient = writable(false);
	const openModalShowIngredient = writable(false);

	async function fetchDataIngredients(pageNumber, keyword) {
		const response = await getIngredients(pageNumber - 1, keyword);
		const data = await response.json();
		if (response.ok) {
			ingredients.set(data.results.content);
			paginationData.set({
				totalPages: data.results.totalPages,
				totalData: data.results.totalElements,
				pageSize: data.results.size
			});
		} else {
			ingredients.set([]);
			showToast(
				t('pages.dashboard.ingredients.error-get-ingredients'),
				generateMessageFromResponse(data),
				'error'
			);
		}
		toggleFetch.set(false);
	}

	const getDataIngredients = (pageNumber, keyword) =>
		loadingStore.wrapFn(() => fetchDataIngredients(pageNumber, keyword));

	function handleSearch(e) {
		e.preventDefault();
		keyword.set(e.target.value);
	}

	function handleOpenModalAddIngredient() {
		openModalAddIngredient.set(true);
	}

	function handleOpenModalShowIngredient(ingredient) {
		ingredientShow.set(ingredient);
		openModalShowIngredient.set(true);
	}

	function handleOpenModalEditIngredient(ingredient) {
		ingredientEdit.set({
			...ingredient,
			image: ingredient.imageLink
		});
		openModalEditIngredient.set(true);
	}

	function handleOpenModalDeleteIngredient(ingredientSlug) {
		ingredientDelete.set({ ingredientSlug });
		openModalDeleteIngredient.set(true);
	}

	async function fetchAddIngredient() {
		const response = await addIngredient({
			ingredientName: $ingredientAdd.ingredientName,
			image: $ingredientAdd.image ? await fileToBase64($ingredientAdd.image) : ''
		});
		const data = await response.json();
		if (response.ok) {
			openModalAddIngredient.set(false);
			ingredientAdd.set({});
			toggleFetch.set(true);
			showToast(
				t('pages.dashboard.ingredients.add-ingredient-success'),
				generateMessageFromResponse(data),
				'success'
			);
		} else {
			showToast(
				t('pages.dashboard.ingredients.add-ingredient-error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	}
	const handleAddIngredient = async () => await loadingStore.wrapFn(() => fetchAddIngredient());

	async function fetchDeleteIngredient() {
		const response = await deleteIngredient($ingredientDelete.ingredientSlug);
		const data = await response.json();
		if (response.ok) {
			showToast(
				t('pages.dashboard.ingredients.delete-ingredient-success'),
				generateMessageFromResponse(data),
				'success'
			);
		} else {
			showToast(
				t('pages.dashboard.ingredients.delete-ingredient-error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
		toggleFetch.set(true);
		ingredientDelete.set({});
	}
	const handleDeleteIngredient = async () =>
		await loadingStore.wrapFn(() => fetchDeleteIngredient());

	async function fetchUpdateIngredient() {
		const response = await updateIngredient($ingredientEdit.ingredientSlug, {
			ingredientName: $ingredientEdit.ingredientName,
			image: $ingredientEdit.image ? await fileToBase64($ingredientEdit.image) : ''
		});
		const data = await response.json();
		if (response.ok) {
			openModalEditIngredient.set(false);
			ingredientAdd.set({});
			toggleFetch.set(true);
			showToast(
				t('pages.dashboard.ingredients.add-ingredient-success'),
				generateMessageFromResponse(data),
				'success'
			);
		} else {
			showToast(
				t('pages.dashboard.ingredients.add-ingredient-error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	}

	const handleEditIngredient = async () =>
		await loadingStore.wrapFn(() =>
			fetchUpdateIngredient($ingredientEdit.ingredientSlug, $ingredientEdit)
		);

	const debounceFetchDataIngredients = _.debounce(getDataIngredients, 500);

	$: debounceFetchDataIngredients($pageNumber, $keyword);
	$: $toggleFetch && debounceFetchDataIngredients($pageNumber, $keyword);
</script>

<section class="bg-gray-50 dark:bg-gray-900 my-8">
	<div class="mx-auto max-w-screen-xl">
		<h1 class="font-bold text-gray-900">{t('pages.dashboard.ingredients.title')}</h1>
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mt-8">
			<div
				class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
			>
				<div class="w-full md:w-1/2">
					<form on:submit={handleSearch}>
						<label for="simple-search" class="sr-only"
							>{t('pages.dashboard.ingredients.search-label')}</label
						>
						<Search
							bind:value={$keyword}
							size="md"
							class="mt-1 w-96 border focus:outline-none"
							placeholder={t('pages.dashboard.ingredients.search-placeholder')}
						/>
					</form>
				</div>
				<div
					class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
				>
					<button
						type="button"
						class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						on:click={handleOpenModalAddIngredient}
					>
						<svg
							class="h-3.5 w-3.5 mr-2"
							fill="currentColor"
							viewbox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								clip-rule="evenodd"
								fill-rule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							/>
						</svg>
						{t('pages.dashboard.ingredients.add-product')}
					</button>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.ingredients.table.ingredient-name')}</th
							>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.ingredients.table.created-at')}</th
							>
							<th scope="col" class="px-4 py-3"
								>{t('pages.dashboard.ingredients.table.updated-at')}</th
							>
							<th scope="col" class="px-4 py-3 text-right"
								>{t('pages.dashboard.ingredients.table.actions')}</th
							>
						</tr>
					</thead>
					<tbody>
						{#if $ingredients.length === 0}
							<tr>
								<td colspan="3" class="text-center px-4 py-3"
									>{t('pages.dashboard.ingredients.table.no-ingredients')}</td
								>
							</tr>
						{/if}
						{#each $ingredients as ingredient}
							<tr>
								<td class="px-4 py-3">
									<div class="flex gap-2 items-center">
										<div class="w-10 h-10 rounded-lg overflow-hidden shadow-md">
											<Image
												props={{
													src: ingredient.imageLink,
													alt: t('pages.dashboard.ingredients.table.ingredient-name'),
													class: 'w-full h-full'
												}}
											/>
										</div>
										{convertToTitleCase(ingredient.ingredientName)}
									</div>
								</td>
								<td class="px-4 py-3">{convertToIndonesianDate(ingredient.createdAt, {withTime: true})}</td>
								<td class="px-4 py-3">{convertToIndonesianDate(ingredient.updateAt, {withTime: true})}</td>
								<td class="px-4 py-3 flex items-center justify-end">
									<button
										class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
										type="button"
									>
										<svg
											class="w-5 h-5"
											aria-hidden="true"
											fill="currentColor"
											viewbox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"
											/>
										</svg>
									</button>
									<Dropdown placement="bottom-end">
										<DropdownItem
											defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
											on:click={() => handleOpenModalShowIngredient(ingredient)}
										>
											{t('pages.dashboard.ingredients.table.show')}
										</DropdownItem>
										<DropdownItem
											defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
											on:click={() => handleOpenModalEditIngredient(ingredient)}
										>
											{t('pages.dashboard.ingredients.table.edit')}
										</DropdownItem>
										<DropdownItem
											defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
											on:click={() => handleOpenModalDeleteIngredient(ingredient.ingredientSlug)}
										>
											{t('pages.dashboard.ingredients.table.delete')}
										</DropdownItem>
									</Dropdown>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<TablePagination
				bind:currentPage={$pageNumber}
				bind:totalData={$paginationData.totalData}
				bind:totalPages={$paginationData.totalPages}
			/>
		</div>
	</div>
</section>

<Modal
	title={t('pages.dashboard.ingredients.show-ingredient')}
	size="sm"
	bind:open={$openModalShowIngredient}
	on:close={() => openModalShowIngredient.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.ingredients.show-ingredient.name')}</Label>
			<p class="font-bold text-gray-900">{convertToTitleCase($ingredientShow.ingredientName)}</p>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.ingredients.show-ingredient.image')}</Label>
			<Image
				props={{
					src: $ingredientShow.imageLink,
					alt: t('pages.dashboard.ingredients.show-ingredient.image'),
					class: 'w-full'
				}}
			/>
		</div>
	</div>
</Modal>

<Modal
	title={t('pages.dashboard.ingredients.add-ingredient')}
	size="sm"
	bind:open={$openModalAddIngredient}
	on:close={() => openModalAddIngredient.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.ingredients.add-ingredient.name')}</Label>
			<Input bind:value={$ingredientAdd.ingredientName} />
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.ingredients.add-ingredient.image')}</Label>
			<div class="flex items-center justify-center w-full">
				<Dropzone
					bind:image={$ingredientAdd.image}
					alt={t('pages.dashboard.ingredients.add-ingredient.image')}
					formatDesc={t('pages.dashboard.ingredients.add-ingredient.image.format')}
				/>
			</div>
		</div>
		<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleAddIngredient}>
			<FloppyDiskOutline />
			{t('pages.dashboard.ingredients.add-ingredient')}</Button
		>
	</div>
</Modal>

<Modal
	title={t('pages.dashboard.ingredients.edit-ingredient')}
	size="sm"
	bind:open={$openModalEditIngredient}
	on:close={() => openModalEditIngredient.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.ingredients.edit-ingredient.name')}</Label>
			<Input bind:value={$ingredientEdit.ingredientName} />
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.ingredients.edit-ingredient.image')}</Label>
			<div class="flex items-center justify-center w-full">
				<Dropzone
					bind:image={$ingredientEdit.image}
					alt={t('pages.dashboard.ingredients.edit-ingredient.image')}
					formatDesc={t('pages.dashboard.ingredients.edit-ingredient.image.format')}
				/>
			</div>
		</div>
		<Button class="mt-4 flex gap-2 text-sm px-4" on:click={handleEditIngredient}>
			<FloppyDiskOutline />
			{t('pages.dashboard.ingredients.edit-ingredient')}</Button
		>
	</div>
</Modal>

<ModalDelete
	bind:open={$openModalDeleteIngredient}
	title={t('pages.dashboard.ingredients.delete-ingredient')}
	onConfirm={handleDeleteIngredient}
/>
