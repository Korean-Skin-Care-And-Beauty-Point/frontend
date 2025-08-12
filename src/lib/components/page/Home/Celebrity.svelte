<script>
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
</script>

<div class="max-w-screen-2xl px-12 py-8 max-sm:px-4 max-sm:py-4">
	<div class="flex items-center gap-4 max-sm:flex-col max-sm:items-start">
		<p class="text-nowrap text-lg font-semibold tracking-tight">Recommended by:</p>
		<div class="grid grid-cols-5 items-center gap-4 max-md:grid-cols-3 max-sm:grid-cols-2">
			{#await data}
				<Skeleton />
			{:then users}
				{#if users?.users.length > 0}
					{#each users?.users.slice(0, 5) as user, index}
						<div class="flex items-center gap-3 rounded-md border border-gray-200 p-2 pr-4">
							{#if user.image}
								<img src={user.image} alt={user.name} />
							{:else}
								<p class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
									{user.name.slice(0, 1)}
								</p>
							{/if}
							<div>
								<p>{user.name}</p>
							</div>
						</div>
					{/each}
				{:else}
					<p>No celebrity found</p>
				{/if}
			{/await}
		</div>
	</div>
</div>
