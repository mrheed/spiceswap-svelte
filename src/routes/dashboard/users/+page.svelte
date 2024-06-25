<script>
	import TablePagination from '@spiceswap/components/Table/TablePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
		convertToIndonesianDate,
		convertToTitleCase,
		fileToBase64,
		generatePageTitleMeta,
		showToast
	} from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import {
		Modal,
		Button,
		DropdownItem,
		Search,
		Dropdown,
		Label,
		Input,
		Badge
	} from 'flowbite-svelte';
	import { FloppyDiskOutline } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	import _ from 'lodash';
	import Image from '@spiceswap/components/Image.svelte';
	import { getUsers, updateUserToAdmin } from '@spiceswap/api/users';
	import { USER_STATUS } from '@spiceswap/common/constant';

	const toggleFetch = writable(false);
	const keyword = writable('');
	const users = writable([]);
	const pageNumber = writable(1);
	const paginationData = writable({
		totalPages: 1,
		pageSize: 10,
		totalData: 0
	});

	const userShow = writable({});

	const openModalShowUser = writable(false);

	async function fetchDataUsers(pageNumber, keyword) {
		const response = await getUsers(pageNumber - 1, keyword);
		const data = await response.json();
		if (response.ok) {
			users.set(data.results.content);
			paginationData.set({
				totalPages: data.results.totalPages,
				totalData: data.results.totalElements,
				pageSize: data.results.size
			});
		} else {
			users.set([]);
			showToast(
				t('pages.dashboard.users.error-get-users'),
				generateMessageFromResponse(data),
				'error'
			);
		}
		toggleFetch.set(false);
	}

	const getDataUsers = (pageNumber, keyword) =>
		loadingStore.wrapFn(() => fetchDataUsers(pageNumber, keyword));

	function handleSearch(e) {
		e.preventDefault();
		keyword.set(e.target.value);
	}

	function handleOpenModalShowUser(user) {
		userShow.set(user);
		openModalShowUser.set(true);
	}

	async function fetchupdateUserToAdmin(user) {
		const response = await updateUserToAdmin(user.username);
		const data = await response.json();
		if (response.ok) {
			toggleFetch.set(true);
			showToast(
				t('pages.dashboard.users.toggle-status-success'),
				generateMessageFromResponse(data),
				'success'
			);
		} else {
			showToast(
				t('pages.dashboard.users.toggle-status-error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	}

	const toggleStatusUser = async (user) => {
		await loadingStore.wrapFn(async () => await fetchupdateUserToAdmin(user));
	};

	const debounceFetchDataUsers = _.debounce(getDataUsers, 500);

	$: debounceFetchDataUsers($pageNumber, $keyword);
	$: if ($toggleFetch) debounceFetchDataUsers($pageNumber, $keyword);
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.users.title'))}
</svelte:head>

<section class="bg-gray-50 dark:bg-gray-900 my-8">
	<div class="mx-auto max-w-screen-xl">
		<h1 class="font-bold text-gray-900">{t('pages.dashboard.users.title')}</h1>
		<div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mt-8">
			<div
				class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
			>
				<div class="w-full md:w-1/2">
					<form on:submit={handleSearch}>
						<label for="simple-search" class="sr-only"
							>{t('pages.dashboard.users.search-label')}</label
						>
						<Search
							bind:value={$keyword}
							size="md"
							class="mt-1 w-96 border bg-white focus:outline-none"
							placeholder={t('pages.dashboard.users.search-placeholder')}
						/>
					</form>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th scope="col" class="px-4 py-3">{t('pages.dashboard.users.table.email')}</th>
							<th scope="col" class="px-4 py-3">{t('pages.dashboard.users.table.user-name')}</th>
							<th scope="col" class="px-4 py-3">{t('pages.dashboard.users.table.status')}</th>
							<th scope="col" class="px-4 py-3">{t('pages.dashboard.users.table.created-at')}</th>
							<th scope="col" class="px-4 py-3">{t('pages.dashboard.users.table.updated-at')}</th>
							<th scope="col" class="px-4 py-3 text-right"
								>{t('pages.dashboard.users.table.actions')}</th
							>
						</tr>
					</thead>
					<tbody>
						{#if $users.length === 0}
							<tr>
								<td colspan="99" class="text-center px-4 py-3"
									>{t('pages.dashboard.users.table.no-users')}</td
								>
							</tr>
						{/if}
						{#each $users as user}
							<tr>
								<td class="px-4 py-3">
									{user.email}
								</td>
								<td class="px-4 py-3">
									{user.username}
								</td>
								<td class="px-4 py-3">
									<Button color="none" class="px-0 py-0" on:click={toggleStatusUser(user)}>
										<Badge color={user.status === USER_STATUS.ACTIVE ? 'green' : 'red'}
											>{user.status}</Badge
										>
									</Button>
								</td>
								<td class="px-4 py-3"
									>{convertToIndonesianDate(user.createdAt, { withTime: true })}</td
								>
								<td class="px-4 py-3"
									>{convertToIndonesianDate(user.updateAt, { withTime: true })}</td
								>
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
											on:click={() => handleOpenModalShowUser(user)}
										>
											{t('pages.dashboard.users.table.show')}
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
	title={t('pages.dashboard.users.show-user')}
	size="sm"
	bind:open={$openModalShowUser}
	on:close={() => openModalShowUser.set(false)}
>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.users.show-user.name')}</Label>
			<p class="font-bold text-gray-900">{convertToTitleCase($userShow.username)}</p>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.users.show-user.email')}</Label>
			<p class="font-bold text-gray-900">{$userShow.email}</p>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.users.show-user.name')}</Label>
			<p class="font-bold text-gray-900">{$userShow.name}</p>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.users.show-user.status')}</Label>
			<div>
				<Badge color={$userShow.status === USER_STATUS.ACTIVE ? 'green' : 'red'}
					>{$userShow.status}</Badge
				>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.users.show-user.email-verification')}</Label>
			<div>
				<Badge color={$userShow.isVerifiedEmail ? 'green' : 'red'}
					>{$userShow.isVerifiedEmail
						? t('pages.dashboard.users.show-user.email-verification.verified')
						: t('pages.dashboard.users.show-user.email-verification.not-verified')}</Badge
				>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<Label>{t('pages.dashboard.users.show-user.image')}</Label>
			<Image
				props={{
					src: $userShow.imageLink,
					alt: t('pages.dashboard.users.show-user.image'),
					class: 'w-full'
				}}
			/>
		</div>
	</div>
</Modal>
