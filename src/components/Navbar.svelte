<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { SCENES, SCENES_FORBIDDEN } from '@spiceswap/common/constant';
	import AppsMenu from '@spiceswap/lib/widgets/AppsMenu.svelte';
	import UserMenu from '@spiceswap/lib/widgets/UserMenu.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { authStore } from '@spiceswap/stores/authStore';
	import { pageStore } from '@spiceswap/stores/pageStore';
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
		goto(`/browse/recipes?keyword=${$keyword}`);
	}

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
					class="font-light mt-1 w-96 border focus:outline-none bg-white"
					placeholder={t('common.nav.search')}
				/>
			</form>
		</div>
		<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
			{#if $authStore.isAuthenticated}
				{#if $pageStore.scene !== SCENES.CREATE_RECIPE && SCENES_FORBIDDEN[$authStore.user.role]?.includes(SCENES.CREATE_RECIPE) === false}
					<button
						type="button"
						on:click={handleCreateRecipe}
						class="me-8 gap-2 flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
					>
						<PlusOutline size="sm" title={t('common.nav.create-recipe')} />
						{t('common.nav.create-recipe')}
					</button>
				{/if}
				<AppsMenu />
				<UserMenu email={$authStore.user.email} name={$authStore.user.name} />
			{:else}
				<div class="hidden md:flex md:items-center md:w-auto w-full md:order-3" id="menu-2">
					<ul
						class="hidden md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0"
					>
						<li>
							<a
								class="inline-block no-underline hover:text-black hover:underline py-2 px-4"
								href="/login">{t('common.nav.login')}</a
							>
						</li>
						<li>
							<a
								class="inline-block no-underline hover:text-black hover:underline py-2 px-4"
								href="/register">{t('common.nav.register')}</a
							>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</NavContainer>
</Navbar>
