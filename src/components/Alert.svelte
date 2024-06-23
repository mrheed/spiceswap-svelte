<script>
	import { twMerge } from "tailwind-merge";

	export let type = 'info'; // default type
	export let message = '';
	export let dismissible = true;
  export let alertClass = ''

	export let dismissed = true; 

	const types = {
		info: {
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-800',
			buttonColor: 'text-blue-500',
			hoverBgColor: 'hover:bg-blue-200',
			ringColor: 'focus:ring-blue-400',
			iconColor: 'dark:text-blue-400'
		},
		error: {
			bgColor: 'bg-red-50',
			textColor: 'text-red-800',
			buttonColor: 'text-red-500',
			hoverBgColor: 'hover:bg-red-200',
			ringColor: 'focus:ring-red-400',
			iconColor: 'dark:text-red-400'
		},
		success: {
			bgColor: 'bg-green-50',
			textColor: 'text-green-800',
			buttonColor: 'text-green-500',
			hoverBgColor: 'hover:bg-green-200',
			ringColor: 'focus:ring-green-400',
			iconColor: 'dark:text-green-400'
		},
		warning: {
			bgColor: 'bg-yellow-50',
			textColor: 'text-yellow-800',
			buttonColor: 'text-yellow-500',
			hoverBgColor: 'hover:bg-yellow-200',
			ringColor: 'focus:ring-yellow-400',
			iconColor: 'dark:text-yellow-300'
		}
	};

  //@ts-ignore
	let alertType = types[type] || types.info;

	function dismissAlert() {
		dismissed = true;
		message = ''; // Clear message on dismiss
		type = 'info'; // Reset type on dismiss
	}

	$: if (message) {
		dismissed = false; // Show alert when there is a message
  //@ts-ignore
		alertType = types[type] || types.info; // Update alertType when type changes
	}
</script>

{#if !dismissed}
	<div
		class={twMerge(`flex items-center p-4 mb-4 ${alertType.textColor} rounded-lg ${alertType.bgColor} dark:bg-gray-800 ${alertType.iconColor}`, alertClass)}
		role="alert"
	>
		<svg
			class="flex-shrink-0 w-4 h-4"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
			/>
		</svg>
		<span class="sr-only">Info</span>
		<div class="ms-3 text-sm font-medium">
      {#if message}
        {@html message}
      {:else}
        <slot />
      {/if}
		</div>
		{#if dismissible}
			<button
				type="button"
				on:click={dismissAlert}
				class={`ms-auto -mx-1.5 -my-1.5 ${alertType.bgColor} ${alertType.buttonColor} rounded-lg focus:ring-2 ${alertType.ringColor} p-1.5 ${alertType.hoverBgColor} inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 ${alertType.iconColor} dark:hover:bg-gray-700`}
				aria-label="Close"
			>
				<span class="sr-only">Close</span>
				<svg
					class="w-3 h-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 14"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
					/>
				</svg>
			</button>
		{/if}
	</div>
{/if}
