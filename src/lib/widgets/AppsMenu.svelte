<script>
	import { t } from '@spiceswap/locale/i18n';
	import { MegaMenu, ToolbarButton } from 'flowbite-svelte';
	import {
		BookOpenOutline,
		GridSolid,
		UsersGroupSolid
	} from 'flowbite-svelte-icons';

	const menu = [
		{ name: t('pages.dashboard.recipe.title'), href: '/dashboard/recipe', icon: BookOpenOutline },
		{ name: t('pages.dashboard.users.title'), href: '/dashboard/users', icon: UsersGroupSolid },
	];
</script>

<ToolbarButton size="lg" class="-mx-0.5 hover:text-gray-900 dark:hover:text-white">
	<GridSolid size="lg" />
</ToolbarButton>
<MegaMenu items={menu} let:item class="border-gray-200">
	<a
		href={item.href}
		class="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 hover:no-underline"
	>
		<svelte:component
			this={item.icon}
			class="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400"
		/>
		<div class="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
	</a>
</MegaMenu>
