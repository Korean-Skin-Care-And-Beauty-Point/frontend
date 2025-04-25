<script>
	let { recommend } = $props();
	// recommend
</script>

<div class="mx-auto max-w-screen-2xl px-12 py-8">
	<div class="flex gap-6">
		<p class="text-nowrap text-2xl font-bold tracking-tight">Recommended by:</p>
		<div class="flex w-full justify-between gap-4">
			{#await recommend}
				<div></div>
			{:then celebrities}
				{#each celebrities?.data as celebrity}
					<a
						href="/category/recommend/1/malika-mahat"
						class="flex w-fit items-start gap-3 rounded-xl border border-gray-300 p-2 pr-6"
					>
						{#if celebrity?.profileImage}
							<img
								src={celebrity?.profileImage}
								alt="{celebrity?.fullName} avatar"
								class="aspect-square w-14 rounded-lg object-cover"
							/>
						{:else}
							<div class="relative aspect-square h-full w-14 rounded-lg bg-gray-300">
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover text-lg font-semibold"
								>
									{celebrity?.fullName.slice(0, 1)}
								</p>
							</div>
						{/if}
						<div class="mt-1 flex flex-col">
							<p class="text-lg font-bold leading-5">{celebrity?.fullName}</p>
							<p class="leading-5">{celebrity?.celebrityProfession}</p>
						</div>
					</a>
				{/each}
			{/await}
		</div>
	</div>
</div>
