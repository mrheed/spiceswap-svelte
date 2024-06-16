<script>
	import AppsMenu from '@spiceswap/lib/widgets/AppsMenu.svelte';
	import UserMenu from '@spiceswap/lib/widgets/UserMenu.svelte';
	import { t } from '@spiceswap/locale/i18n';
	import { authStore } from '@spiceswap/stores/authStore';
</script>

<!--Nav-->
<nav id="header" class="w-full z-30 top-0 py-1" style="z-index: 1000;">
	<div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-6 py-3">
		<label for="menu-toggle" class="cursor-pointer md:hidden block">
			<svg
				class="fill-current text-gray-900"
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 20 20"
			>
				<title>menu</title>
				<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
			</svg>
		</label>
		<input class="hidden" type="checkbox" id="menu-toggle" />

		<div class="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu-1">
			<nav>
				<ul class="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
					<li>
						<a class="inline-block no-underline hover:text-black hover:underline py-2 px-4" href="#"
							>Shop</a
						>
					</li>
					<li>
						<a class="inline-block no-underline hover:text-black hover:underline py-2 px-4" href="#"
							>About</a
						>
					</li>
					{#if !$authStore.isAuthenticated}
						<li>
							<a
								class="inline-block md:hidden no-underline hover:text-black hover:underline py-2 px-4 menu-item"
								href="/login">{t('common.nav.login')}</a
							>
						</li>
						<li>
							<a
								class="inline-block md:hidden no-underline hover:text-black hover:underline py-2 px-4 menu-item"
								href="/register">{t('common.nav.register')}</a
							>
						</li>
					{/if}
				</ul>
			</nav>
		</div>

		<div class="order-1 md:order-2">
			<a
				class="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl"
				href="#"
			>
				<img src="/logo_text.png" class="h-12" alt="Logo" />
			</a>
		</div>

		{#if $authStore.isAuthenticated}
			<div class="order-2 md:order-3 flex items-center gap-2" id="nav-content">
				<AppsMenu />
				<UserMenu email={$authStore.user.email} name={$authStore.user.name} />
			</div>
		{:else}
			<div class="hidden md:flex md:items-center md:w-auto w-full md:order-3" id="menu-2">
				<ul
					class="hidden md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0"
				>
					<li>
						<a
							class="inline-block no-underline hover:text-black hover:underline py-2 px-4"
							href="/login">{t('common.nav.login')}</a
						>
					</li>
					<li>
						<a
							class="inline-block no-underline hover:text-black hover:underline py-2 px-4"
							href="/register">{t('common.nav.register')}</a
						>
					</li>
				</ul>
			</div>
		{/if}
	</div>
</nav>
