<script>
	import { StarOutline, StarSolid } from 'flowbite-svelte-icons';
	import Image from '../Image.svelte';
	import Bookmark from './Bookmark.svelte';
	import { t } from '@spiceswap/locale/i18n';

	export let recipes = [];
	export let withBookmark = true;
	export let gridCount = 4;
</script>

<div class="grid grid-cols-{gridCount} mt-8 gap-4">
	{#each recipes as recipe}
		<div class="relative">
			<div class="h-72 relative hover:grow hover:shadow-xl">
				<Image
					props={{
						src: recipe.thumbnailImageLink,
						alt: recipe.recipeName,
						class: 'h-full w-full object-center object-cover'
					}}
				/>
				<div class="absolute top-3 left-2">
					<span class="text-white bg-gray-900 bg-opacity-50 px-2 py-1 rounded-md"
						>{recipe.createdAt}</span
					>
				</div>
				{#if withBookmark}
					<div class="absolute bottom-4 right-4 cursor-pointer">
						<div class="bg-gray-900 bg-opacity-30 rounded-md">
							<Bookmark {recipe} />
						</div>
					</div>
				{/if}
			</div>
			<div class="flex flex-col justify-between py-2 gap-2">
				<span class="font-bold">{recipe.recipeName}</span>
				<span class="flex gap-1">
					<i class="text-yellow-400 flex">
						{#each Array(5).fill() as _, i}
							{#if i + 1 <= recipe.totalRating}
								<StarSolid />
							{:else}
								<StarOutline />
							{/if}
						{/each}
					</i>
					<span class="italic font-light text-sm">
						{recipe.totalRating}
						{t('common.review')}
					</span>
				</span>
			</div>
		</div>
	{/each}
</div>
