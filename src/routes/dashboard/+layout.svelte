<script>
	import { goto } from '$app/navigation';
	import Navbar from '@spiceswap/components/Navbar.svelte';
	import { authStore } from '@spiceswap/stores/authStore';
	import { browser } from '$app/environment';

	function handleLogout() {
		if (browser) {
			goto('/login');
		}
	}

	$: if (!$authStore.isAuthenticated) {
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
