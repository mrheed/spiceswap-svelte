<script>
	import '@spiceswap/routes/app.css';
	import '@spiceswap/routes/styles.css';
	import { loadingStore } from '@spiceswap/stores/loadingStore.js';
	import { browser } from '$app/environment';
	import { authStore } from '@spiceswap/stores/authStore';
	import Footer from '@spiceswap/components/Footer.svelte';
	import { navigating } from '$app/stores';
	import ProgressBar from 'svelte-progress-bar';

	let progress = null;

	if (browser) {
		if (localStorage.getItem('token')) {
			authStore.login(localStorage.getItem('token'));
		}
	}

	$: {
		if (browser) {
			if (!progress) {
				progress = new ProgressBar({
					target: document.querySelector('body')
				});
			}
			if ($loadingStore.isLoading || $loadingStore.isFullPageLoading || $navigating) {
				progress.start();
			} else {
				progress.complete();
			}
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
	{#if $loadingStore.isFullPageLoading}
		<div class="overlay show flex flex-col justify-center items-center">
			<div class="loader mb-12"></div>
			<p class="plus-jakarta font-medium text-center text-black text-xl text-white">Please wait</p>
		</div>
	{/if}
</div>
