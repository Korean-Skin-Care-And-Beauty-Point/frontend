<script lang="ts">
	// import '../app.css';
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import Navbar from '$lib/components/layout/client/Navbar.svelte';
	import Footer from '$lib/components/layout/client/Footer.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { RenderScan } from 'svelte-render-scan';
	import { dev } from '$app/environment';
	let { children, data } = $props();
</script>

{#if dev}
	<RenderScan />
{/if}

<div class="mx-auto grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
	<Navbar user={data?.locals} category={data?.category} />
	{@render children()}
	<Footer />
</div>
<Toaster position="top-center" richColors />

<style>
	:global(input) {
		background-color: transparent;
	}
</style>
