import { json } from '@sveltejs/kit';
import db from '../../../lib/server/db/db';
import { ObjectId } from 'mongodb';

/**
 * Products REST API
 *
 * --> GET
 *  Returns the list of products
 *
 * --> POST
 *  Create a new product
 *
 * --> PATCH
 *  Modify a existing product
 *
 * --> DELETE
 *  Deletes an existing product
 */

export async function GET() {
	return json(await (await db).collection('products').find().toArray());
}

export async function POST({ request }) {
	const data = await request.json();
	data['uploadTime'] = new Date().toISOString();
	await (await db).collection('products').insertOne(data);
	return json({ success: true, message: 'Document inserted successfully.' });
}

export async function PATCH({ request }) {
	const data = await request.json();
	if (!data) {
		return json({ success: false, message: 'No data provided for update.' }, 400);
	}

	const id = new ObjectId(data['_id']);
	const existingProduct = await (await db).collection('products').findOne({ _id: id });
	if (!existingProduct) {
		return json({ success: false, message: 'Product not found.' }, 404);
	}

	if ('nutritional_table' in data) {
		data['nutritional_table'] = JSON.parse(data['nutritional_table']);
		Object.keys(data['nutritional_table']).forEach((k) => {
			data['nutritional_table'][k] = JSON.parse(data['nutritional_table'][k]);
		});
	}
	if ('informative_text' in data) data['informative_text'] = JSON.parse(data['informative_text']);

	delete data['_id'];
	const result = await (await db).collection('products').updateOne({ _id: id }, { $set: data });

	if (result.modifiedCount === 1) {
		return json({ success: true, message: 'Product updated successfully.' });
	} else {
		return json({ success: false, message: 'Product not found or no updates made.' }, 404);
	}
}

export async function DELETE({ request }) {
	const ids = await request.json();
	if (!ids) {
		return json({ success: false, message: 'No product IDs provided for deletion.' }, 400);
	}

	const idArray = ids.split(',').map((id) => {
		return new ObjectId(id);
	});
	const result = await (await db).collection('products').deleteMany({ _id: { $in: idArray } });

	if (result.deletedCount > 0) {
		return json({ success: true, message: 'Products deleted successfully.' });
	} else {
		return json({ success: false, message: 'Products not found or already deleted.' }, 404);
	}
}
