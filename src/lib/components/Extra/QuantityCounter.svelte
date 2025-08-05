<script lang="ts">
	// let quantity = $state(0);
	let { quantity = $bindable() } = $props();

	$effect(() => {
		if (!quantity || quantity < 1) {
			quantity = 1;
		}
	});
	function increment() {
		quantity++;
	}

	function decrement() {
		if (quantity > 1) {
			quantity -= 1;
		}
	}
</script>

<div class="flex w-min items-center gap-1">
	<button class="rounded-sm bg-primary px-2.5 text-lg text-white" onclick={decrement}>-</button>
	<input
		type="text"
		bind:value={quantity}
		name="quantity"
		class="h-7 w-7 rounded-md border border-gray-300 bg-white text-center"
	/>
	<button class="rounded-sm bg-primary px-2.5 text-lg text-white" onclick={increment}>+</button>
</div>
