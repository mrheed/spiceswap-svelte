<script>
	import './app.css';
	import './styles.css';
	import { loadingStore } from '../stores/loadingStore.js';
	import { browser } from '$app/environment';
	import { authStore } from '../stores/authStore';
	import { goto } from '$app/navigation';
	import Footer from '../components/Footer.svelte';

	if (browser) {
		if (localStorage.getItem('token')) {
			authStore.login(localStorage.getItem('token'));
			goto('/dashboard');
		}
	}
</script>

<div class="app">
	<div class="flex justify-between flex-col" style="min-height: 100vh">
		<main>
			<slot />
		</main>
		<Footer />
	</div>
	{#if $loadingStore.isLoading}
		<div class="overlay show flex flex-col justify-center items-center">
			<div class="loader mb-12"></div>
			<p class="plus-jakarta font-medium text-center text-black text-xl text-white">Please wait</p>
		</div>
	{/if}
</div>
