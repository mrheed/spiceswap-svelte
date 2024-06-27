<script>
	import { t } from '@spiceswap/locale/i18n';
	import { Input, Label } from 'flowbite-svelte';

	export let portion = '';
	export let ingredients = [];
	export let steps = [];

	$: console.log(portion, ingredients, steps);
</script>

<div class="grid grid-cols-2 gap-x-16 gap-y-8 mt-4">
	<div class="flex flex-col gap-1">
		<Label>{t('pages.dashboard.recipe.detail.history-detail.portion')}</Label>
		<div class="flex gap-2">
			<p class="text-sm">{portion ? portion : t('pages.dashboard.recipe.detail.history-detail.no-portion')}</p>
		</div>
	</div>
	<div></div>
	<div class="flex flex-col gap-1">
		<div class="w-full">
			<div class="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
				<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th class=" py-3">{t('pages.dashboard.recipe.detail.history-detail.ingredient.name')}</th>
							<th class=" py-3">{t('pages.dashboard.recipe.detail.history-detail.ingredient.amount')}</th>
						</tr>
					</thead>
					{#if ingredients.length == 0}
						<tr>
							<td class="py-3" colspan="99">
								<p>{t('pages.dashboard.recipe.detail.history-detail.no-ingredients')}</p>
							</td>
						</tr>
					{/if}
					{#each ingredients as ingredient, index}
						<tr>
							<td class=" py-3">
								<p>{ingredient.ingredientName}</p>
							</td>
							<td class=" py-3">
								<p>{ingredient.dose}</p>
							</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<div class="w-full">
			<div class="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
				<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th class=" py-3">{t('pages.dashboard.recipe.detail.history-detail.step.title')}</th>
						</tr>
					</thead>
					{#if steps.length == 0}
						<tr>
							<td class="py-3" colspan="99">
								<p>{t('pages.dashboard.recipe.detail.history-detail.no-steps')}</p>
							</td>
						</tr>
					{/if}
					{#each steps as step, index}
						<tr>
							<td class=" py-3 flex flex-col gap-2">
								<Label class="font-bold"
									>{t('pages.dashboard.recipe.update.steps.step', {
										step: step.numberStep
									})}</Label
								>
								<p>{step.stepDescription}</p>
							</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
</div>
