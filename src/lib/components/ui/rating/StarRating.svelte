<script lang="ts">
	type Config = {
		emptyColor?: string;
		fullColor?: string;
		showText?: boolean;
		size?: number;
	};
	import isNumber from './isNumber';
	import makeUniqueId from './makeUniqueId';
	import Star from './Star.svelte';

	let {
		rating,
		style = '',
		config = {}
	}: { rating: number; style?: string; config?: Config } = $props();

	const id = makeUniqueId();

	if (!isNumber(rating) || rating < 0 || rating > 5) {
		throw new Error('rating value is not valid! 🙅‍♀️');
	}

	let full = $derived(Math.floor(rating));
	let half = $derived(rating - full);
	let empty = $derived(Math.floor(5 - rating));

	let fullArr = $derived(Array(full).fill(1));
	let halfArr = $derived(half !== 0 ? [half] : []);
	let emptyArr = $derived(Array(empty).fill(0));

	let stars = $derived(fullArr.concat(halfArr).concat(emptyArr));

	const size = config.size && isNumber(config.size) ? config.size : 20;
	const fontSize = size / 2 < 16 ? 16 : size / 2;
</script>

<div {style}>
	{#each stars as star}
		<Star {id} full={star} emptyColor={config.emptyColor} fullColor={config.fullColor} {size} />
	{/each}
	{#if config.showText}<span style="font-size:{fontSize}px">{rating}</span>{/if}
</div>

<style>
	div {
		display: flex;
		/* margin-bottom: 14px; */
	}
	span {
		color: #7f7f7f;
		line-height: 1;
		align-self: center;
		margin-left: 8px;
	}
</style>
