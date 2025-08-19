<script lang="ts">
	import '../app.css';
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import metaImage from '$Lib/assets/img/meta.png';

	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { RenderScan } from 'svelte-render-scan';
	import { dev } from '$app/environment';
	let { children } = $props();
</script>

<svelte:head>
	<title>
		{$pageTitle.title || 'Koren Skin Care & Beauty Clinic'} | Best in class skin care health in town.
	</title>
	<meta
		name="title"
		content="{$pageTitle.title ||
			'Koren Skin Care & Beauty Clinic'} | Best in class skin care health in town."
	/>
	<meta name="description" content={$pageTitle.description} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://koreanskincareandclinic.com" />
	<meta
		property="og:title"
		content="{$pageTitle.title ||
			'Koren Skin Care & Beauty Clinic'} | Best in class skin care health in town."
	/>
	<meta property="og:description" content={$pageTitle.description} />
	<meta property="og:image" content={metaImage} />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://koreanskincareandclinic.com" />
	<meta
		property="twitter:title"
		content="{$pageTitle.title ||
			'Koren Skin Care & Beauty Clinic'} | Best in class skin care health in town."
	/>
	<meta property="twitter:description" content={$pageTitle.description} />
	<meta property="twitter:image" content={metaImage} />
</svelte:head>

{#if dev}
	<RenderScan />
{/if}

<Toaster position="top-center" richColors />
{@render children()}
