<script>
	import AppsMenu from '@spiceswap/lib/widgets/AppsMenu.svelte';
	import UserMenu from '@spiceswap/lib/widgets/UserMenu.svelte';
	import { t } from '@spiceswap/locale/i18n';
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
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	export let fluid = false;
	export let drawerHidden = false;
	export let list = false;
</script>

<Navbar {fluid} class="fixed text-black shadow" color="default" let:NavContainer>
	<NavContainer class="mb-px mt-px px-1" {fluid}>
		<NavHamburger
			onClick={() => (drawerHidden = !drawerHidden)}
			class="m-0 me-3 md:block lg:hidden"
		/>
		<NavBrand href="/" class={list ? 'w-40' : 'lg:w-60'}>
			<img
				src="/logo_text.png"
				class="h-10"
				alt="SpiceSwap Logo"
			/>
		</NavBrand>
		<div class="hidden lg:block">
			{#if list}
				<NavUl class="ml-2" activeUrl="/" activeClass="text-primary-600 dark:text-primary-500">
					<NavLi href="/">Home</NavLi>
					<NavLi href="#top">Messages</NavLi>
					<NavLi href="#top">Profile</NavLi>
					<NavLi href="#top">Settings</NavLi>
					<NavLi class="cursor-pointer">
						Dropdown
						<ChevronDownOutline  class="ms-0 inline" />
					</NavLi>
					<Dropdown class="z-20 w-44">
						<DropdownItem href="#top">Item 1</DropdownItem>
						<DropdownItem href="#top">Item 2</DropdownItem>
						<DropdownItem href="#top">Item 3</DropdownItem>
					</Dropdown>
				</NavUl>
			{:else}
				<form>
					<Search size="md" class="mt-1 w-96 border focus:outline-none" placeholder={t('common.nav.search')}/>
				</form>
			{/if}
		</div>
		<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
			<AppsMenu />
			<UserMenu />
		</div>
	</NavContainer>
</Navbar>
