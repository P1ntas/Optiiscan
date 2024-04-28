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

	const id = new ObjectId(data['id']);
	const existingProduct = await (await db).collection('products').findOne({ _id: id });
	if (!existingProduct) {
		return json({ success: false, message: 'Log not found.' }, 404);
	}

	const updateFields = {
		code: data['code'],
		name: data['name'],
		description: data['description'] ?? '',
		labels: data['labels'] ?? ''
	};

	const result = await (await db)
		.collection('products')
		.updateOne({ _id: id }, { $set: updateFields });

	if (result.modifiedCount === 1) {
		return json({ success: true, message: 'Log updated successfully.' });
	} else {
		return json({ success: false, message: 'Log not found or no updates made.' }, 404);
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
