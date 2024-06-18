<script>
	import { goto } from '$app/navigation';
	import Navbar from '@spiceswap/components/Navbar.svelte';
	import { authStore } from '@spiceswap/stores/authStore';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { pageStore } from '@spiceswap/stores/pageStore';
	import { ROUTE_TO_SCENE, SCENES_FORBIDDEN } from '@spiceswap/common/constant';
	import { Button } from 'flowbite-svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { page } from '$app/stores';

	// Store to manage the loaded state of the page
	const loaded = writable(false);
	// Store to manage if the current scene is forbidden for the user
	const isForbidden = writable(false);

	// Set the current scene based on the route
	$: pageStore.setScene(ROUTE_TO_SCENE[$page.route.id]);

	// Check if the current scene is forbidden for the user's role
	$: isForbidden.set(
		$authStore.user.role && SCENES_FORBIDDEN[$authStore.user.role]?.includes($pageStore.scene)
	);

	// Set the loaded state to true once the session checking is completed
	$: if (!$authStore.checkingSession) {
		loaded.set(true);
	}

	// Redirect to login if the user is not authenticated, the page is loaded, and it's a browser environment
	$: if (!$authStore.isAuthenticated && $loaded && browser) {
		goto('/login');
	}
</script>

<div>
	{#if $authStore.isAuthenticated}
		<Navbar />
		<div class="px-44 pt-20">
			{#if $isForbidden}
				<div class="mt-16 flex flex-col gap-4 items-center justify-center">
					<h1 class="text-6xl font-bold">{t('forbidden.title')}</h1>
					<p class="text-gray-500 w-1/2 text-center">{t('forbidden.description')}</p>
					<Button on:click={() => goto('/dashboard')}>{t('forbidden.button')}</Button>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	{/if}
</div>
