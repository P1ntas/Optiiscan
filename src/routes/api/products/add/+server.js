import { json } from '@sveltejs/kit';
import db from '../../../../lib/server/db/db';

export async function GET() {
	const data = {
		name: 'Product Name',
		nutrition_facts: {
			calories: Math.round(Math.random() * 100),
			fat: Math.round(Math.random() * 100),
			carbs: Math.round(Math.random() * 100),
			protein: Math.round(Math.random() * 100),
		},
	};

	try {
		await (await db).collection('products').insertOne(data);
		return json({ success: true, message: 'Document inserted successfully.' });
	} catch (error) {
		return json({ success: false, error: error.message });
	}
}
