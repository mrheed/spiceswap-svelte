<script>
	import { onMount } from 'svelte';
	export let props;
	const { src, alt, ...restProps } = props;

	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
		const img = new Image();
		img.src = src;
		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});
</script>

{#if loaded}
	<img {src} {...restProps} {alt} />
{:else if failed}
	<img src="https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg" alt="Not Found" />
{:else if loading}
	<div
		class="w-full h-full show flex flex-col justify-center items-center"
		style="background-color: rgba(0,0,0,.3);"
	>
		<div class="loader mb-12"></div>
		<p class="plus-jakarta font-medium text-center text-black text-xl text-white">Please wait</p>
	</div>
{/if}
