<script lang="ts">
	import { imagesPath } from '@spiceswap/lib/variables';
	import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import { authStore } from '../../stores/authStore';
	import { goto } from '$app/navigation';
	import { t } from '@spiceswap/locale/i18n';

	export let name: string = 'User'; // "Neil Sims",
	export let avatar: string = ''; // "neil-sims.png",
	export let email: string = 'user@email.com'; // "neil.sims@flowbite.com",
</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
	{#if avatar}
		<Avatar size="sm" src={imagesPath(avatar, 'users')} tabindex="0" />
	{:else}
		<a href="#">
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
		</a>
	{/if}
</button>
<Dropdown placement="bottom-end">
	<DropdownHeader>
		<span class="block text-sm">{name}</span>
		<span class="block text-sm font-light">{email}</span>
	</DropdownHeader>
	<DropdownItem
		on:click={() => goto('/')}
		defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
	>
		{t('common.nav.home')}</DropdownItem
	>
	<DropdownItem
		on:click={() => goto('/dashboard')}
		defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
	>
		{t('common.nav.dashboard')}</DropdownItem
	>
	<DropdownItem
		on:click={() => goto('/profile')}
		defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
	>
		{t('common.nav.profile')}</DropdownItem
	>
	<DropdownItem
		on:click={() => goto('/bookmark')}
		defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
	>
		{t('common.nav.bookmark')}</DropdownItem
	>
	<DropdownDivider />
	<DropdownItem
		on:click={() => authStore.logout()}
		defaultClass="font-medium py-2 px-4 text-sm hover:bg-gray-1000 dark:hover:bg-gray-600 flex gap-2 items-center"
	>
		{t('common.nav.logout')}</DropdownItem
	>
</Dropdown>
