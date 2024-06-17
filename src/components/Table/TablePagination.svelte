<script>
	import { t } from '@spiceswap/locale/i18n';

	export let totalData = 0;
	export let currentPage = 1;
	export let totalPages = 6
  export let pageSize = 10

	const handleClickPagination = (page) => {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
	};
</script>

<nav
	class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
	aria-label="Table navigation"
>
	<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
		{@html t('common.table.pagination.range', { min: (currentPage - 1) * pageSize + 1, max: (currentPage - 1) * pageSize + pageSize, total: totalData })}
	</span>
	<ul class="inline-flex items-stretch -space-x-px">
		<li>
			<button
				type="button"
				on:click={() => handleClickPagination(currentPage - 1)}
				class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
			>
				<span class="sr-only">{t('common.table.pagination.previous')}</span>
				<svg
					class="w-5 h-5"
					aria-hidden="true"
					fill="currentColor"
					viewbox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</li>
		{#each Array(totalPages) as _, i (i)}
			{#if (
        ((i < 3 || i > totalPages - 3) && (currentPage < 4 || i > totalPages - 3)) ||
        (currentPage > 2 && i == 0) ||
        (i === currentPage - 1 && currentPage > 2) ||
        (currentPage > totalPages - 2 && i < 3) || 
        (i < 2 && currentPage > totalPages - 3)
      )}
				<li>
					<button
						type="button"
						on:click={() => handleClickPagination(i + 1)}
						class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-7000 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white {currentPage ===
						i + 1
							? 'z-10 text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
							: ''}">{i + 1}</button
					>
				</li>
			{:else if (
        (i === 3 && (currentPage < 4 || totalPages <= 6)) ||
        (i === 2 && currentPage > 3) ||
        (i === currentPage && (currentPage < totalPages - 4 || currentPage < totalPages - 2)) ||
        (currentPage > totalPages - 2 && i === 4)
      )}
				<li>
					<button
						type="button"
						class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						disabled>...</button
					>
				</li>
			{/if}
		{/each}
		<li>
			<button
				type="button"
				on:click={() => handleClickPagination(currentPage + 1)}
				class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
			>
				<span class="sr-only">{t('common.table.pagination.next')}</span>
				<svg
					class="w-5 h-5"
					aria-hidden="true"
					fill="currentColor"
					viewbox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</li>
	</ul>
</nav>
