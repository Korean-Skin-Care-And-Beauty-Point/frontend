<script>
	import fullLogo from '$lib/assets/img/logo/full_logo.png';
	import Phone from 'lucide-svelte/icons/phone';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Mail from 'lucide-svelte/icons/mail';
	import SiFacebook from '@icons-pack/svelte-simple-icons/icons/SiFacebook';
	import SiInstagram from '@icons-pack/svelte-simple-icons/icons/SiInstagram';
	import SiTikTok from '@icons-pack/svelte-simple-icons/icons/SiTiktok';
</script>

<div class="mx-auto w-full max-w-screen-2xl bg-primary/10 px-12 pb-4 pt-10 max-md:px-4">
	<div
		class="grid w-full grid-cols-4 items-start justify-between gap-12 max-md:flex max-md:flex-col max-md:gap-4"
	>
		<div>
			<div class="flex flex-col gap-4">
				<img src={fullLogo} alt="Korean Skin Care Logo" class="w-48" />
				<p class="text-sm">
					At Korean Skin Care & Beauty Clinic, we believe that skincare is an art and science
					combined. Our mission is to bring out the natural beauty in each of our clients through
					advanced treatments and personalized care. Trusted by Nepal’s top celebrities, we deliver
					results-driven, clinically proven skincare solutions designed to rejuvenate, restore, and
					glow. With a licensed dermatologist on staff, we offer the highest standards of care and
					expertise, ensuring every treatment is both safe and effective
				</p>
				<div class="flex flex-col gap-2">
					<a href="tel:9849365761" class="flex items-center gap-2">
						<Phone size={20} strokeWidth={1.5} color="#AF272F" />
						<p class="text-sm">(+977) 984-936-5761 / 01-4011568</p>
					</a>
					<a href="https://maps.app.goo.gl/Gx2N5XvhZMqwpmFa8" class="flex items-center gap-2">
						<MapPin size={20} strokeWidth={1.5} color="#AF272F" />
						<p class="text-sm">City Center, First Floor, Kathmandu 44600, Nepal</p>
					</a>
					<a href="mailto:kscclinicnepal@gmail.com" class="flex items-center gap-2">
						<Mail size={20} strokeWidth={1.5} color="#AF272F" />
						<p class="text-sm">kscclinicnepal@gmail.com</p>
					</a>
				</div>
			</div>
		</div>
		<div class="w-full">
			<div class="flex flex-col gap-2">
				<p class="text-lg font-semibold tracking-tight">About KSCBC</p>
				<ul class="flex flex-col gap-2">
					<li>
						<a href="/about-us" class="text-sm">About us</a>
					</li>
					<li>
						<a href="/about-us" class="text-sm">My Account</a>
					</li>
					<li>
						<a href="/about-us" class="text-sm">Privacy & Policy</a>
					</li>
					<li>
						<a href="/about-us" class="text-sm">Contact Us</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="w-full">
			<div class="flex flex-col gap-2">
				<p class="text-lg font-semibold tracking-tight">Customer Support</p>
				<ul class="flex flex-col gap-2">
					<li>
						<a href="/about-us" class="text-sm">F.A.Q</a>
					</li>
					<li>
						<a href="/about-us" class="text-sm">Refund and Exchange Policy</a>
					</li>
					<li>
						<a href="/about-us" class="text-sm">Payment Information</a>
					</li>
					<li>
						<a href="/about-us" class="text-sm">Shipping and Delivery</a>
					</li>
				</ul>
			</div>
		</div>
		<div></div>
	</div>
	<hr class="mt-6 border border-primary/10" />
	<div
		class="mt-4 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4"
	>
		<p class="text-sm">&copy; {new Date().getFullYear()} Korean Skin Care & Beauty Clinic</p>
		<ul class="flex items-center gap-4">
			<li>
				<a href="https://www.facebook.com/koreanskincareclinic/"
					><SiFacebook size={16} color={'#0c0a09'} /></a
				>
			</li>
			<li>
				<a href="https://www.instagram.com/korean_skincare_nepal_/"
					><SiInstagram size={16} color={'#0c0a09'} /></a
				>
			</li>
			<li>
				<a href="https://www.tiktok.com/@koreanskincareclinic_np"
					><SiTikTok size={16} color={'#0c0a09'} /></a
				>
			</li>
		</ul>
	</div>
</div>
