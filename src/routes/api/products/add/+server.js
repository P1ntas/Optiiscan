import { json } from '@sveltejs/kit';
import db from '../../../../lib/server/db/db';

export async function GET() {
	const data = {
		id: Math.round(Math.random() * 541),
		barcode: Math.round(Math.random() * 7841),
		vegan: Math.random() > 0.5,
		weight: Math.round(Math.random() * 77)
	};

	try {
		await (await db).collection('products').insertOne(data);
		return json({ success: true, message: 'Document inserted successfully.' });
	} catch (error) {
		return json({ success: false, error: error.message });
	}
}
