<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { emailVerifyRegister } from './request.js';
	import { loadingStore } from '../../stores/loadingStore.js';
	import Alert from '../../components/Alert.svelte';
	let verificationCode = '';
	let alertState = {
		type: '',
		message: ''
	};

	//@ts-ignore
	async function handleVerify(event) {
		event.preventDefault();
		try {
			loadingStore.setLoading(true);
			const response = await emailVerifyRegister(verificationCode);
			const data = await response.json();
			if (response.ok) {
				alertState.message =
					"Verification successful. Please return to the <a href='/login'>login page</a>.";
				alertState.type = 'success';
			} else {
				alertState.message = data.message;
				alertState.type = 'error';
			}
		} catch (error) {
			//@ts-ignore
			alertState.message = error.message;
			alertState.type = 'error';
		} finally {
			loadingStore.setLoading(false);
		}
	}

	onMount(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const tokenFromUrl = urlParams.get('token');
		if (tokenFromUrl) {
			verificationCode = tokenFromUrl;
		}
	});

	$: verificationCode;
</script>

<div
	class="flex flex-col items-center justify-center px-6 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900"
>
	<a
		href="#"
		class="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
	>
		<img src="/logo_text.png" alt="Logo" class="h-20" />
	</a>
	<!-- Card -->
	<div class="w-full max-w-md bg-white rounded-lg shadow md:mt-0 xl:p-0 dark:bg-gray-800">
		<div class="w-full p-6 sm:p-8">
			<div class="flex space-x-4"></div>
			<Alert type={alertState.type} message={alertState.message} />
			<p class="font-light text-sm mb-4">
				Please enter your email verification code to complete registration.
			</p>
			<form class="mt-4 space-y-6" on:submit={handleVerify}>
				<div>
					<label
						for="profile-lock"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Verification Code</label
					>
					<input
						type="text"
						name="profile-lock"
						id="profile-lock"
						bind:value={verificationCode}
						class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						placeholder="••••••••"
						required
					/>
				</div>
				<div class="flex gap-2">
					<button
						type="submit"
						class="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>
						<svg
							class="w-5 h-5 mr-2 -ml-1"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
							></path></svg
						>
						Verify
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
