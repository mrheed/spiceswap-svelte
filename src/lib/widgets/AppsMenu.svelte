<script>
	import { ROLES, ROUTE_TO_SCENE, SCENES_FORBIDDEN } from '@spiceswap/common/constant';
	import { t } from '@spiceswap/locale/i18n';
	import { authStore } from '@spiceswap/stores/authStore';
	import { MegaMenu, ToolbarButton } from 'flowbite-svelte';
	import {
		BookOpenOutline,
		ClipboardListOutline,
		GridOutline,
		GridSolid,
		HomeOutline,
		UsersGroupSolid
	} from 'flowbite-svelte-icons';

	let menu = [
		{ name: t('common.nav.home'), href: '/', icon: HomeOutline },
		{ name: t('common.nav.dashboard'), href: '/dashboard', icon: GridOutline },
		{ name: t('common.nav.recipe'), href: '/dashboard/recipe', icon: BookOpenOutline },
		{
			name: t('common.nav.ingredients'),
			href: '/dashboard/ingredients',
			icon: ClipboardListOutline
		},
		{ name: t('common.nav.users'), href: '/dashboard/users', icon: UsersGroupSolid }
	];

	$: {
		if (ROLES[$authStore.user.role]) {
			menu = menu.filter((item) => {
				const scene = ROUTE_TO_SCENE[item.href];
				if (scene === false) return true;
				return SCENES_FORBIDDEN[$authStore.user.role].includes(scene) === false;
			});
		}
	}
</script>

<ToolbarButton size="lg" class="-mx-0.5 hover:text-gray-900 dark:hover:text-white">
	<GridSolid size="lg" />
</ToolbarButton>
<MegaMenu items={menu} let:item class="border-gray-200" style="z-index: 99">
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
