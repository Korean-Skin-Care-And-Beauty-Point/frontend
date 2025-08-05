import { writable } from 'svelte/store';

interface profileFormdata {
	name: string;
	email: string;
	phoneNumber: string;
	dob: string | Date | undefined;
	gender: string;
	address: string;
	description: string;
}

const initialFormData: profileFormdata = {
	name: '',
	email: '',
	phoneNumber: '',
	dob: '',
	gender: '',
	address: '',
	description: ''
};

export const formData = writable<profileFormdata>(initialFormData);
