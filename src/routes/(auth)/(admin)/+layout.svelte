<script>
	import Sidebar from '$lib/components/page/Admin/Sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import { Toaster } from 'svelte-sonner';
	const { children } = $props();
</script>

<svelte:head>
	<title>
		{$pageTitle.title || 'Dashboard'}
	</title>
	<meta name="title" content={$pageTitle.title || 'Dashboard'} />
	<meta name="description" content={$pageTitle.description} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://localhost:5173" />
	<meta property="og:title" content="{$pageTitle.title || 'Dashboard'} " />
	<meta property="og:description" content={$pageTitle.description} />
	<meta property="og:image" content="https://metatags.io/images/meta-tags.png" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://colthinkspace.com" />
	<meta property="twitter:title" content={$pageTitle.title || 'Dashboard'} />
	<meta property="twitter:description" content={$pageTitle.description} />
	<meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
</svelte:head>

<Toaster position="top-center" richColors />
<div class="grid grid-cols-12 gap-2">
	<div class="col-span-2">
		<Sidebar />
	</div>
	<div class="col-span-10 w-full">
		<div class="w-full bg-white"></div>
		<ScrollArea class="h-full w-full bg-primary/5">
			{@render children()}
		</ScrollArea>
	</div>
</div>
