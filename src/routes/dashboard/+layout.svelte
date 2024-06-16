<script>
	import { goto } from '$app/navigation';
	import Navbar from '@spiceswap/components/Navbar.svelte';
	import { authStore } from '@spiceswap/stores/authStore';
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';

	let loaded = false;

	function handleLogout() {
		if (browser) {
			goto('/login');
		}
	}

	onMount(async () => {
		setTimeout(() => {
			loaded = true;
		}, 1000);
	});

	$: if (!$authStore.isAuthenticated && loaded) {
		handleLogout();
	}
</script>

<div>
	{#if $authStore.isAuthenticated}
		<Navbar />
		<div class="px-44 pt-20">
			<slot />
		</div>
	{/if}
</div>
