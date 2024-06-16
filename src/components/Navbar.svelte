<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AppsMenu from '@spiceswap/lib/widgets/AppsMenu.svelte';
	import UserMenu from '@spiceswap/lib/widgets/UserMenu.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { authStore } from '@spiceswap/stores/authStore';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import { getUrlParams } from '@spiceswap/utils/common';
	import { NavBrand, Navbar, Search } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let fluid = false;

	const keyword = writable('');

	onMount(() => {
		if (browser) {
			const urlParams = new URLSearchParams($page.url.search);
			const keywordParam = urlParams.get('keyword');
			keyword.set(keywordParam ? keywordParam : '');
		}
	});

	function handleCreateRecipe() {
		goto('/dashboard/recipe/create');
	}

	function handleSearch(e) {
		e.preventDefault();
		goto(`/dashboard/recipe/browse-recipes?keyword=${$keyword}`);
	}

	$: $pageStore.scene;
</script>

<Navbar
	{fluid}
	class="fixed text-black shadow"
	style="z-index: 1000;"
	color="default"
	let:NavContainer
>
	<NavContainer class="mb-px mt-px px-1" {fluid}>
		<NavBrand href="/" class="w-40">
			<img src="/logo_text.png" class="h-10" alt="SpiceSwap Logo" />
		</NavBrand>
		<div class="hidden lg:block">
			<form on:submit={handleSearch}>
				<Search
					bind:value={$keyword}
					size="md"
					class="mt-1 w-96 border focus:outline-none"
					placeholder={t('common.nav.search')}
				/>
			</form>
		</div>
		<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
			{#if $pageStore.scene !== 'create_recipe'}
				<button
					type="button"
					on:click={handleCreateRecipe}
					class="me-8 py-2 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none"
				>
					<PlusOutline />
					{t('common.nav.create-recipe')}
				</button>
			{/if}
			<AppsMenu />
			<UserMenu email={$authStore.user.email} name={$authStore.user.name} />
		</div>
	</NavContainer>
</Navbar>
