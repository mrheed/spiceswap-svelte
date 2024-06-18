<script>
	import { imagesPath } from '@spiceswap/lib/variables';
	import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { t } from '@spiceswap/locale/i18n';
	import { authStore } from '@spiceswap/stores/authStore';
	import { ROLES, ROUTE_TO_SCENE, SCENES_FORBIDDEN } from '@spiceswap/common/constant';

	export let name = 'User'; // "Neil Sims",
	export let avatar = ''; // "neil-sims.png",
	export let email = 'user@email.com'; // "neil.sims@flowbite.com",

	let menuItems = [
		{ label: 'common.nav.profile', route: '/profile' },
		{ label: 'common.nav.my-recipe', route: '/dashboard/recipe/my-recipes' },
		{ label: 'common.nav.modification-request', route: '/modification-request' },
		{ label: 'common.nav.bookmark', route: '/bookmark' },
		{ label: 'common.nav.logout', action: () => authStore.logout() }
	];

	$: {
		if (ROLES[$authStore.user.role]) {
			menuItems = menuItems.filter((item) => {
				const scene = ROUTE_TO_SCENE[item.route];
				if (scene === false) return true;
				return SCENES_FORBIDDEN[$authStore.user.role].includes(scene) === false;
			});
		}
	}
</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
	{#if avatar}
		<Avatar size="sm" src={imagesPath(avatar, 'users')} tabindex="0" />
	{:else}
		<svg
			class="fill-current hover:text-black"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<circle fill="none" cx="12" cy="7" r="3" />
			<path
				d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z"
			/>
		</svg>
	{/if}
</button>
<Dropdown placement="bottom-end">
	<DropdownHeader>
		<span class="block text-sm">{name}</span>
		<span class="block text-sm font-light">{email}</span>
	</DropdownHeader>
	{#each menuItems as item}
		{#if item.label !== 'common.nav.logout'}
			<DropdownItem
				on:click={item.action ? item.action : () => goto(item.route)}
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
			>
				{t(item.label)}
			</DropdownItem>
		{:else}
			<DropdownDivider />
			<DropdownItem
				on:click={item.action}
				defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-1000 dark:hover:bg-gray-600 flex gap-2 items-center"
			>
				{t(item.label)}
			</DropdownItem>
		{/if}
	{/each}
</Dropdown>
