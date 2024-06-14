<script>
	import Alert from '@spiceswap/components/Alert.svelte';
	import { registerUser } from '@spiceswap/api/auth';
	import { loadingStore } from '@spiceswap/stores/loadingStore';
	import { generateErrorMessage } from '@spiceswap/utils/fetch';
	import { generatePageTitleMeta } from '@spiceswap/utils/common';
	import { t } from '@spiceswap/locale/i18n';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let name = '';
	let alertState = {
		type: '',
		message: ''
	};

	// @ts-ignore
	async function handleSubmit(event) {
		event.preventDefault();
		if (password !== confirmPassword) {
			alertState.message = t('pages.register.error.password-not-match');
			alertState.type = 'error';
			return;
		}
		try {
			loadingStore.setLoading(true);
			const response = await registerUser(username, name, email, password);
			const data = await response.json();
			if (response.ok) {
				alertState.message = t('pages.register.success');
				alertState.type = 'success';
			} else {
				alertState.message = t('pages.register.error', { error: generateErrorMessage(data) });
				alertState.type = 'error';
			}
		} catch (error) {
			alertState.message = t('pages.register.error.general');
			alertState.type = 'error';
		} finally {
			loadingStore.setLoading(false);
		}
	}
</script>

<svelte:head>
	{@html generatePageTitleMeta('Register')}
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
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">{t('pages.register.title')}</h2>
		<Alert type={alertState.type} message={alertState.message} />
		<form class="mt-8 space-y-6" on:submit={handleSubmit}>
			<div>
				<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.register.label.email')}</label
				>
				<input
					type="email"
					name="email"
					id="email"
					bind:value={email}
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="name@company.com"
					required
				/>
			</div>
			<div>
				<label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.register.label.username')}</label
				>
				<input
					type="text"
					name="username"
					id="username"
					bind:value={username}
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="username"
					required
				/>
			</div>
			<div>
				<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.register.label.name')}</label
				>
				<input
					type="text"
					name="name"
					id="name"
					bind:value={name}
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="your name"
					required
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.register.label.password')}</label
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
			<div>
				<label
					for="confirm-password"
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>{t('pages.register.label.confirm-password')}</label
				>
				<input
					type="password"
					name="confirm-password"
					id="confirm-password"
					bind:value={confirmPassword}
					placeholder="••••••••"
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					required
				/>
			</div>
			<!-- <div class="flex items-start">
				<div class="flex items-center h-5">
					<input
						id="remember"
						aria-describedby="remember"
						name="remember"
						type="checkbox"
						bind:checked={remember}
						class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
						required
					/>
				</div>
				<div class="ml-3 text-sm">
					<label for="remember" class="font-medium text-gray-900 dark:text-white"
						>I accept the <a href="#" class="text-primary-700 hover:underline dark:text-primary-500"
							>Terms and Conditions</a
						></label
					>
				</div>
			</div> -->
			<button
				type="submit"
				class="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				>{t('pages.register.button.register')}</button
			>
			<div class="text-sm font-medium text-gray-500 dark:text-gray-400">
				{t('pages.register.already-have-account')} <a
					href="/login"
					class="text-primary-700 hover:underline dark:text-primary-500">{t('pages.register.login')}</a
				>
			</div>
		</form>
	</div>
</div>
