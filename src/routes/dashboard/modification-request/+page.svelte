<script>
	import { goto } from '$app/navigation';
	import {
		getInboxModificationRequest,
		getOutboxModificationRequest
	} from '@spiceswap/api/modification-request';
	import { MODIFICATION_REQUEST_TYPE } from '@spiceswap/common/constant';
	import RecipePagination from '@spiceswap/components/Recipe/RecipePagination.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { generatePageTitleMeta, showToast } from '@spiceswap/utils/common';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';
	import {
		ArrowDownToBracketOutline,
		ArrowUpFromBracketOutline,
		PlusOutline
	} from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';

	let previousType;
	const type = writable(MODIFICATION_REQUEST_TYPE.IN);
	const inboxModificationRequest = writable([]);
	const outboxModificationRequest = writable([]);
	const page = writable(0);
	const totalPages = writable(0);

	const fetchInboxModificationRequest = async (page) => {
		const response = await getInboxModificationRequest(page);
		const data = await response.json();
		if (response.ok) {
			inboxModificationRequest.set(data.results.content);
			totalPages.set(data.results.totalPages);
		} else {
			showToast(
				t('pages.dashboard.modification-request.error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	};

	const fetchOutboxModificationRequest = async (page) => {
		const response = await getOutboxModificationRequest(page);
		const data = await response.json();
		if (response.ok) {
			outboxModificationRequest.set(data.results.content);
			totalPages.set(data.results.totalPages);
		} else {
			showToast(
				t('pages.dashboard.modification-request.error'),
				generateMessageFromResponse(data),
				'error'
			);
		}
	};

	const handlePageChange = (_pageNumber) => {
		page.set(_pageNumber - 1);
	};

	$: if ($type === MODIFICATION_REQUEST_TYPE.IN) {
		loadingStore.wrapFn(async () => await fetchInboxModificationRequest($page));
	} else if ($type === MODIFICATION_REQUEST_TYPE.OUT) {
		loadingStore.wrapFn(async () => await fetchOutboxModificationRequest($page));
	}

	$: if (previousType !== $type) {
		previousType = $type;
		page.set(0);
	}
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.dashboard.modification-request.title'))}
</svelte:head>

<div class="my-8 px-48">
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
		<Tabs contentClass="p-4">
			<TabItem open={$type === MODIFICATION_REQUEST_TYPE.IN}>
				<div slot="title" class="font-semibold flex gap-2 items-center">
					<ArrowDownToBracketOutline size="sm" />
					{t('pages.dashboard.modification-request.in')}
				</div>
				<div class="border px-4 py-2 rounded-lg"></div>
			</TabItem>
			<TabItem open={$type === MODIFICATION_REQUEST_TYPE.OUT}>
				<div slot="title" class="font-semibold flex gap-2 items-center">
					<ArrowUpFromBracketOutline size="sm" />
					{t('pages.dashboard.modification-request.out')}
				</div>
				{t('pages.dashboard.modification-request.out')}
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
