<script>
	import { goto } from '$app/navigation';
	import {
		approveInboxModificationRequest,
		getInboxModificationRequest,
		getOutboxModificationRequest,
		rejectInboxModificationRequest
	} from '@spiceswap/api/modification-request';
	import {
		MODIFICATION_REQUEST_STATUS,
		MODIFICATION_REQUEST_TYPE,
		STATUS
	} from '@spiceswap/common/constant';
	import Alert from '@spiceswap/components/Alert.svelte';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import {
		convertToIndonesianDate,
		generatePageTitleMeta,
		showToast
	} from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import {
		ArrowDownToBracketOutline,
		ArrowUpFromBracketOutline,
		CheckOutline,
		CloseOutline,
		PlusOutline
	} from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	import { twMerge } from 'tailwind-merge';

	const type = writable({
		[MODIFICATION_REQUEST_TYPE.IN]: true,
		[MODIFICATION_REQUEST_TYPE.OUT]: false
	});
	const reload = writable(false);
	const previousType = writable('');
	const inboxModificationRequest = writable([]);
	const outboxModificationRequest = writable([]);
	const page = writable(0);
	const totalPages = writable(0);
	const isLoading = writable(true);
	const badgeStatus = {
		[STATUS.WAITING]:
			'bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
		[STATUS.ACCEPTED]:
			'bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
		[STATUS.REJECTED]:
			'bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300',
		[STATUS.FAILED]:
			'bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'
	};

	const fetchInboxModificationRequest = async (page) => {
		isLoading.set(true);
		const response = await getInboxModificationRequest(page);
		const data = await response.json();
		if (response.ok) {
			inboxModificationRequest.set(data.results.content);
			totalPages.set(data.results.totalPages);
		} else {
			inboxModificationRequest.set([]);
		}
		isLoading.set(false);
	};

	const fetchOutboxModificationRequest = async (page) => {
		isLoading.set(true);
		const response = await getOutboxModificationRequest(page);
		const data = await response.json();
		if (response.ok) {
			outboxModificationRequest.set(data.results.content);
			totalPages.set(data.results.totalPages);
		} else {
			outboxModificationRequest.set([]);
		}
		isLoading.set(false);
	};

	const handlePageChange = (_pageNumber) => {
		page.set(_pageNumber - 1);
	};

	const fetchApproveRequest = async (fromRecipeSlug) => {
		const response = await approveInboxModificationRequest(fromRecipeSlug);
		const data = await response.json();
		if (response.ok) {
			showToast(
				t('pages.dashboard.modification-request.approve.success'),
				generateMessageFromResponse(data),
				'success'
			);
			reload.set(true);
		} else {
			showToast(
				t('pages.dashboard.modification-request.approve.error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	};

	const fetchRejectRequest = async (fromRecipeSlug) => {
		const response = await rejectInboxModificationRequest(fromRecipeSlug);
		const data = await response.json();
		if (response.ok) {
			showToast(
				t('pages.dashboard.modification-request.reject.success'),
				generateMessageFromResponse(data),
				'success'
			);
			reload.set(true);
		} else {
			showToast(
				t('pages.dashboard.modification-request.reject.error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	};

  const approveRequest = async (fromRecipeSlug) => loadingStore.wrapFn(async () => await fetchApproveRequest(fromRecipeSlug))
  const rejectRequest = async (fromRecipeSlug) => loadingStore.wrapFn(async () => await fetchRejectRequest(fromRecipeSlug))

	$: if ($type[MODIFICATION_REQUEST_TYPE.IN] && $type[MODIFICATION_REQUEST_TYPE.OUT] === false) {
		previousType.set(MODIFICATION_REQUEST_TYPE.IN);
		loadingStore.wrapFn(async () => await fetchInboxModificationRequest($page));
	} else if (
		$type[MODIFICATION_REQUEST_TYPE.OUT] &&
		$type[MODIFICATION_REQUEST_TYPE.IN] === false
	) {
		previousType.set(MODIFICATION_REQUEST_TYPE.OUT);
		loadingStore.wrapFn(async () => await fetchOutboxModificationRequest($page));
	}

	$: if ($reload) {
		if ($type[MODIFICATION_REQUEST_TYPE.IN]) {
			loadingStore.wrapFn(async () => await fetchInboxModificationRequest($page));
		} else if ($type[MODIFICATION_REQUEST_TYPE.OUT]) {
			loadingStore.wrapFn(async () => await fetchOutboxModificationRequest($page));
		}
    reload.set(false)
	}

	$: {
		const isInTypeChanged =
			$previousType == MODIFICATION_REQUEST_TYPE.IN && !$type[MODIFICATION_REQUEST_TYPE.OUT];
		const isOutTypeChanged =
			$previousType == MODIFICATION_REQUEST_TYPE.OUT && !$type[MODIFICATION_REQUEST_TYPE.IN];
		if (isInTypeChanged || isOutTypeChanged) {
			page.set(0);
			totalPages.set(0);
		}
	}
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.modification-request.title'))}
</svelte:head>

<div class="my-8 px-64">
	<h1 class="font-bold text-4xl">{t('pages.dashboard.modification-request.title')}</h1>
	<div class="mt-8 px-10 py-6 bg-white rounded-lg shadow overflow-hidden">
		<Button
			color="primary"
			on:click={() => {
				goto('/dashboard/modification-request/create');
			}}
		>
			<PlusOutline class="w-4 h-4 mr-2" />
			{t('pages.dashboard.modification-request.create')}
		</Button>
		<hr class="my-8" />
		<Tabs contentClass="px-4">
			<TabItem bind:open={$type[MODIFICATION_REQUEST_TYPE.IN]}>
				<div slot="title" class="font-semibold flex gap-2 items-center">
					<ArrowDownToBracketOutline size="sm" />
					{t('pages.dashboard.modification-request.in')}
				</div>
				{#if $isLoading}
					<div class="flex justify-center items-center h-full">
						<Spinner />
					</div>
				{:else}
					<ul class="w-full divide-y divide-gray-2000 dark:divide-gray-700">
						{#if $inboxModificationRequest.length === 0}
							<div class="flex justify-center items-center h-full">
								<Alert type="warning" dismissed={false} dismissible={false} alertClass="w-full">
									{t('pages.dashboard.modification-request.in.empty')}
								</Alert>
							</div>
						{/if}
						{#each $inboxModificationRequest as modificationRequest}
							<li class="py-3 sm:py-4">
								<div class="flex space-x-4 rtl:space-x-reverse">
									<div class="flex-1 min-w-0">
										<p class="font-semibold truncate dark:text-white">
											{t('pages.dashboard.modification-request.in.list-title', {
												requestFrom: modificationRequest.requestFrom
											})}
										</p>
										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											{t('pages.dashboard.modification-request.in.list-desc', {
												fromRecipeName: modificationRequest.fromRecipeName,
												toRecipeName: modificationRequest.toRecipeName
											})}
										</p>
										<div class="flex gap-2 items-center">
											<a
												class="text-sm"
												href={`/browse/recipes/${modificationRequest.fromRecipeSlug}`}
											>
												{t('pages.dashboard.modification-request.in.list-status.detail-from')}
											</a>
											{#if modificationRequest.requestStatus !== STATUS.FAILED}
												<span>|</span>
												<a
													class="text-sm"
													href={`/browse/recipes/${modificationRequest.toRecipeSlug}`}
												>
													{t('pages.dashboard.modification-request.in.list-status.detail-to')}
												</a>
											{/if}
										</div>
									</div>
									<div
										class="flex flex-col gap-2 justify-center items-center text-base font-semibold text-gray-900 dark:text-white"
									>
										<p class={twMerge('text-sm', badgeStatus[modificationRequest.requestStatus])}>
											{MODIFICATION_REQUEST_STATUS[modificationRequest.requestStatus]}
										</p>
										<p class="text-sm font-light">
											{convertToIndonesianDate(modificationRequest.createdAt)}
										</p>
										<div class="flex gap-2">
											{#if modificationRequest.canApprove}
												<Button
													size="xs"
													color="green"
													class="flex gap-2 py-1"
													on:click={() => approveRequest(modificationRequest.fromRecipeSlug)}
												>
													<CheckOutline size="xs" />
													{t('pages.dashboard.modification-request.approve')}
												</Button>
												<Button
													size="xs"
													color="red"
													class="flex gap-2 py-1"
													on:click={() => rejectRequest(modificationRequest.fromRecipeSlug)}
												>
													<CloseOutline size="xs" />
													{t('pages.dashboard.modification-request.reject')}
												</Button>
											{/if}
										</div>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</TabItem>
			<TabItem bind:open={$type[MODIFICATION_REQUEST_TYPE.OUT]}>
				<div slot="title" class="font-semibold flex gap-2 items-center">
					<ArrowUpFromBracketOutline size="sm" />
					{t('pages.dashboard.modification-request.out')}
				</div>
				{#if $isLoading}
					<div class="flex justify-center items-center h-full">
						<Spinner />
					</div>
				{:else}
					<ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
						{#if $outboxModificationRequest.length === 0}
							<div class="flex justify-center items-center h-full">
								<Alert type="warning" dismissed={false} dismissible={false} alertClass="w-full">
									{t('pages.dashboard.modification-request.out.empty')}
								</Alert>
							</div>
						{/if}
						{#each $outboxModificationRequest as modificationRequest}
							<li class="py-3 sm:py-4">
								<div class="flex items-center space-x-4 rtl:space-x-reverse">
									<div class="flex-1 min-w-0">
										<p class="font-semibold truncate dark:text-white">
											{t('pages.dashboard.modification-request.out.list-title', {
												requestTo: modificationRequest.requestTo
											})}
										</p>
										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											{t('pages.dashboard.modification-request.out.list-desc', {
												fromRecipeName: modificationRequest.fromRecipeName,
												toRecipeName: modificationRequest.toRecipeName
											})}
										</p>
										<div class="flex gap-2 items-center">
											<a
												class="text-sm"
												href={`/browse/recipes/${modificationRequest.fromRecipeSlug}`}
											>
												{t('pages.dashboard.modification-request.out.list-status.detail-from')}
											</a>
											{#if modificationRequest.requestStatus !== STATUS.FAILED}
												<span>|</span>
												<a
													class="text-sm"
													href={`/browse/recipes/${modificationRequest.toRecipeSlug}`}
												>
													{t('pages.dashboard.modification-request.out.list-status.detail-to')}
												</a>
											{/if}
										</div>
									</div>
									<div
										class="flex flex-col gap-2 justify-center items-center text-base font-semibold text-gray-900 dark:text-white"
									>
										<p class={twMerge('text-sm', badgeStatus[modificationRequest.requestStatus])}>
											{MODIFICATION_REQUEST_STATUS[modificationRequest.requestStatus]}
										</p>
										<p class="text-sm font-light">
											{convertToIndonesianDate(modificationRequest.createdAt)}
										</p>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</TabItem>
		</Tabs>
		<div class="flex justify-center mt-8">
			<RecipePagination
				number={$page + 1}
				totalPages={$totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	</div>
</div>
