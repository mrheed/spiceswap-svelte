<script>
	import { goto } from '$app/navigation';
	import AppsMenu from '@spiceswap/lib/widgets/AppsMenu.svelte';
	import UserMenu from '@spiceswap/lib/widgets/UserMenu.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import {
		DarkMode,
		Dropdown,
		DropdownItem,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		Search
	} from 'flowbite-svelte';
	import { ChevronDownOutline, PlusOutline } from 'flowbite-svelte-icons';

	export let fluid = false;

	function handleCreateRecipe() {
		goto('/dashboard/recipe/create');
	}

	$: $pageStore.scene;
</script>

<Navbar {fluid} class="fixed text-black shadow" color="default" let:NavContainer>
	<NavContainer class="mb-px mt-px px-1" {fluid}>
		<NavBrand href="/" class="w-40">
			<img src="/logo_text.png" class="h-10" alt="SpiceSwap Logo" />
		</NavBrand>
		<div class="hidden lg:block">
			<form>
				<Search
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
			<UserMenu />
		</div>
	</NavContainer>
</Navbar>
