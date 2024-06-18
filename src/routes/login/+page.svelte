<script>
	import { goto } from '$app/navigation';
	import { generatePageTitleMeta } from '@spiceswap/utils/common.js';
	import { authStore } from '@spiceswap/stores/authStore.js';
	import { loadingStore } from '@spiceswap/stores/loadingStore.js';
	import { loginUser } from '@spiceswap/api/auth';
	import { t } from '@spiceswap/locale/i18n';
	import { generateMessageFromResponse } from '@spiceswap/utils/fetch';
	import Alert from '@spiceswap/components/Alert.svelte';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let remember = false;
	let alertState = {
		type: '',
		message: ''
	};

	async function handleSubmit(event) {
		event.preventDefault();
		await loadingStore.wrapFn(async () => {
			const response = await loginUser(email, password);
			const data = await response.json();
			if (response.ok) {
				localStorage.setItem('accessToken', data.results.accessToken);
				localStorage.setItem('refreshToken', data.results.refreshToken);
				authStore.login();
				await authStore.fetchUserData()
				goto('/dashboard');
			} else {
				alertState.message = t('pages.login.error', { error: generateMessageFromResponse(data) });
				alertState.type = 'error';
			}
		});
	}

	$: {
		if ($authStore.isAuthenticated) {
			goto('/dashboard');
		}
	}
</script>

<svelte:head>
	{@html generatePageTitleMeta(t('pages.login.title'))}
</svelte:head>

<div
	class="flex flex-col items-center mt-8 justify-center px-6 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900"
>
	<a
		href="/"
		class="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-16 dark:text-white"
	>
		<img src="/logo_text.png" alt="Logo" class="h-20" />
	</a>
	<!-- Card -->
	<div
		class="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg border shadow dark:bg-gray-800"
	>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">{t('pages.login.title')}</h2>
		<Alert type={alertState.type} message={alertState.message} />
		<form class="mt-8 space-y-6" on:submit={handleSubmit}>
			<div>
				<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.login.label.email')}</label
				>
				<input
					type="text"
					name="email"
					id="email"
					bind:value={email}
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="name@email.com"
					required
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.login.label.password')}</label
				>
				<input
					type="password"
					name="password"
					id="password"
					bind:value={password}
					placeholder="••••••••"
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					required
				/>
			</div>
			<div class="flex items-start">
				<div class="flex items-center h-5">
					<input
						id="remember"
						aria-describedby="remember"
						name="remember"
						type="checkbox"
						bind:checked={remember}
						class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
					/>
				</div>
				<div class="ml-3 text-sm">
					<label for="remember" class="font-medium text-gray-900 dark:text-white"
						>{t('pages.login.remember-me')}</label
					>
				</div>
				<a href="#" class="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
					>{t('pages.login.lost-password')}</a
				>
			</div>
			<button
				type="submit"
				class="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				>{t('pages.login.button.login')}</button
			>
			<div class="text-sm font-medium text-gray-500 dark:text-gray-400">
				{t('pages.login.not-registered')}
				<a href="/register" class="text-primary-700 hover:underline dark:text-primary-500"
					>{t('pages.login.create-account')}</a
				>
			</div>
		</form>
	</div>
</div>
