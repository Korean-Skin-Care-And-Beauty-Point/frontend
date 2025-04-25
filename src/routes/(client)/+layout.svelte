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

<svelte:head>
	<title>
		{$pageTitle.title || 'Koren Skin Care and Beauty Point'} | Best in class korean skin care and skin
		health in town.
	</title>
	<meta
		name="title"
		content="{$pageTitle.title ||
			'Koren Skin Care and Beauty Point'} | Best in class korean skin care and skin
		health in town."
	/>
	<meta name="description" content={$pageTitle.description} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://localhost:5173" />
	<meta
		property="og:title"
		content="{$pageTitle.title ||
			'Koren Skin Care and Beauty Point'} | Best in class korean skin care and skin
		health in town."
	/>
	<meta property="og:description" content={$pageTitle.description} />
	<meta property="og:image" content="https://metatags.io/images/meta-tags.png" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://colthinkspace.com" />
	<meta
		property="twitter:title"
		content="{$pageTitle.title ||
			'Koren Skin Care and Beauty Point'} | Best in class korean skin care and skin
		health in town."
	/>
	<meta property="twitter:description" content={$pageTitle.description} />
	<meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
</svelte:head>

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
