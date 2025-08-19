import { writable } from 'svelte/store';

export const pageTitle = writable({
	title: '',
	description:
		'Discover premium Korean skincare and beauty products. Elevate skin health with expert treatments tailored for radiant, glowing, and healthy skin.'
});
