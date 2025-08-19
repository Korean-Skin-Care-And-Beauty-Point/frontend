<script>
	import fullLogoWhite from '$lib/assets/img/logo/full_logo_white.png';
	import {
		Boxes,
		DiamondPercent,
		House,
		Image,
		LayoutPanelLeft,
		ShoppingCart,
		User
	} from 'lucide-svelte';
	import { page } from '$app/state';

	const sidebar = [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: House
		},
		{
			title: 'Banners',
			url: '/dashboard/banner',
			icon: Image
		},
		{
			title: 'Users',
			url: '/dashboard/users',
			icon: User
		},
		{
			title: 'Product Category',
			url: '/dashboard/category',
			icon: LayoutPanelLeft
		},
		{
			title: 'Product',
			url: '/dashboard/product',
			icon: Boxes
		},
		{
			title: 'Orders',
			url: '/dashboard/order',
			icon: ShoppingCart
		},
		{
			title: 'Discount',
			url: '/dashboard/discount',
			icon: DiamondPercent
		}
	];
</script>

<div class="flex h-screen w-full flex-col gap-6 bg-primary px-4 py-4">
	<div class="flex w-full justify-center">
		<img src={fullLogoWhite} alt="Korean skin care and Beauty clnic logo" class="h-full w-44" />
	</div>
	<hr class="rounded-full border border-red-500" />
	<div>
		<ul class="flex flex-col gap-1">
			{#each sidebar as item}
				{@const Icon = item.icon}
				<li class="w-full">
					<a
						href={item.url}
						class="flex w-full items-center gap-3 rounded-md text-sm hover:bg-red-500/30 {page.url
							.pathname === item.url
							? 'bg-red-400/50'
							: ''}  px-3 py-2 text-white"
					>
						<Icon size={18} strokeWidth={1.5} />
						{item.title}
					</a>
				</li>
			{/each}
		</ul>
		<div>
			<img src="" alt="" />
		</div>
	</div>
</div>
