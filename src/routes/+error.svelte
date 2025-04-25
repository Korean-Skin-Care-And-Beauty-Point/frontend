<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="mx-auto flex w-full flex-col items-center justify-center py-32">
	<h1 class="text-4xl font-semibold tracking-tight">{page?.status}</h1>
	<h2 class="text-4xl font-semibold tracking-tight">{page.error?.message}</h2>
</div>
