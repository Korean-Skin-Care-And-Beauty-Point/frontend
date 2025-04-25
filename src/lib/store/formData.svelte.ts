import { writable } from 'svelte/store';

interface profileFormdata {
    fullName: string,
    email: string,
    phoneNumber: string,
    dob: string,
    gender: string,
    address: string,
    description: string;
}

const initialFormData: profileFormdata = {
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    address: '',
    description: ''
};


export const formData = writable<profileFormdata>(initialFormData);
