<script lang="ts">
	let { children, data } = $props();
	import { page } from '$app/state';

	console.log(data?.locals?.user);
</script>

<div class="mx-auto grid w-full max-w-screen-2xl grid-cols-12 gap-6 px-12 py-8">
	<div class="col-span-2 flex flex-col gap-3 border-r border-gray-300">
		<div class="flex flex-col gap-2">
			<p class="font-semibold">Manage Account</p>
			<ul class="flex flex-col gap-1 pl-3">
				<li class="flex flex-col gap-1">
					<a
						href="/me/profile"
						class="text-gray-500 {page.url.pathname === '/me/profile' ? 'text-primary' : ''}"
						>My Profile</a
					>
					<!-- <a
						href="/me/payment"
						class="text-gray-500 {page.url.pathname === '/me/payment' ? 'text-primary' : ''}"
						>My Payment Options</a
					> -->
				</li>
				{#if data?.locals?.user?.role === 'CELEBRITY'}
					<li class="flex flex-col gap-1">
						<a
							href="/me/favourite"
							class="text-gray-500 {page.url.pathname === '/me/favourite' ? 'text-primary' : ''}"
							>My favourite</a
						>
					</li>
				{/if}
			</ul>
		</div>
		<div class="flex flex-col gap-2">
			<p class="font-semibold">Orders</p>
			<ul class="flex flex-col gap-1 pl-3">
				<li>
					<a
						href="/me/order"
						class="text-gray-500 {page.url.pathname === '/me/order' ? 'text-primary' : ''}"
						>My Orders</a
					>
				</li>
				<li>
					<a
						href="/me/order/return"
						class="text-gray-500 {page.url.pathname === '/me/order/return' ? 'text-primary' : ''}"
						>Returns</a
					>
				</li>
				<li>
					<a
						href="/me/order/cancellation"
						class="text-gray-500 {page.url.pathname === '/me/order/cancellation'
							? 'text-primary'
							: ''}">Cancellations</a
					>
				</li>
				<li>
					<a
						href="/me/order/review"
						class="text-gray-500 {page.url.pathname === '/me/order/review' ? 'text-primary' : ''}"
						>Reviews</a
					>
				</li>
				<li>
					<a
						href="/me/order/wishlist"
						class="text-gray-500 {page.url.pathname === '/me/order/wishlist' ? 'text-primary' : ''}"
						>Wishlists</a
					>
				</li>
			</ul>
		</div>
	</div>
	<div class="col-span-10">
		{@render children()}
	</div>
</div>
