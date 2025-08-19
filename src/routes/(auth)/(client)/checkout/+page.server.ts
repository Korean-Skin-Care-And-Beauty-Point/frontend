// import { VITE_ESEWA_DEV_PAYMENT_LINK } from '$env/static/private';
import { uuidv7 } from 'uuidv7';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ request, url }) {
		const data = await request.formData();
		const productIds = data.getAll('productId[]');
		const attributes = data.getAll('attributes[]');
		const quantity = data.getAll('quantity[]');
		const userId = data.get('user');
		const paymentMethod = data.get('paymentMethod');
		// const product = data.get("product[]");

		if (paymentMethod === 'ESEWA') {
			const txnUUID = uuidv7();
			const amount = data.get('amount');
			const taxAmount = data.get('tax_amount');
			const totalAmount = data.get('total_amount');
			const productCode = 'EPAYTEST';
			const serviceCharge = data.get('service_charge') || 0;
			const deliveryCharge = data.get('delivery_charge') || 0;
			const successUrl = `${url.origin}/success`;
			const failureUrl = `${url.origin}/failure`;
			const signedFieldUrl = `total_amount,transaction_uuid,product_code`;
			const encoder = new TextEncoder();
			const data = encoder.encode(signedFieldUrl);
			const signature = crypto.subtle.digest('SHA-256', data);

			const body = {
				amount: amount,
				tax_amount: taxAmount,
				total_amount: totalAmount,
				product_code: productCode,
				service_charge: serviceCharge,
				delivery_charge: deliveryCharge,
				success_url: successUrl,
				failure_url: failureUrl,
				signed_field_url: signedFieldUrl,
				signature: signature
			};

			console.log(signature);

			console.log(txnUUID);
			// const payment = await fetch(`${VITE_ESEWA_DEV_PAYMENT_LINK}`,{

			// })
		}

		// console.log(product.id);

		console.log(productIds, attributes, quantity, userId, paymentMethod);
	}
};
