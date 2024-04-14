import { json } from '@sveltejs/kit';
import db from '../../../lib/server/db/db';
import { ObjectId } from 'mongodb';

/**
 * Logs REST API
 *
 * --> GET
 *  Returns the list of logs
 *
 * --> POST
 *  Create a new log
 *  >> Expects in the body:
 *      description
 *      numImages
 *
 * --> PATCH
 *  Modify a existing log
 *  >> Expects in the body (both optional):
 *      status (-1: aborted / 0: running / 1: completed)
 *      info (new message to append to the log)
 *
 * --> DELETE
 *  Deletes an existing log
 *  >> Expects in the body:
 *      _id of the document
 */

export async function GET() {
	return json(await (await db).collection('logs').find().toArray());
}

export async function POST({ request }) {
	const data = await request.json();
	data['uploadDate'] = new Date().toLocaleString();
	data['finishDate'] = null;
	data['info'] = [];
	data['status'] = 0;

	await (await db).collection('logs').insertOne(data);
	return json({ success: true, message: 'Document inserted successfully.' });
}

export async function PATCH({ request }) {
	const data = await request.json();
	if (!data) {
		return json({ success: false, message: 'No data provided for update.' }, 400);
	}

	const id = new ObjectId(data['id']);
	const existingLog = await (await db).collection('logs').findOne({ _id: id });
	if (!existingLog) {
		return json({ success: false, message: 'Log not found.' }, 404);
	}

	const updateFields = {};

	if ('status' in data) {
		updateFields['status'] = data['status'];
	}

	if ('info' in data) {
		let updatedInfo = existingLog.info || [];
		updatedInfo.push(data['info']);
		updateFields['info'] = updatedInfo;
	}

	if (Object.keys(updateFields).length === 0) {
		return json({ success: false, message: 'No valid fields provided for update.' }, 400);
	}

	const result = await (await db)
		.collection('logs')
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
		return json({ success: false, message: 'No log IDs provided for deletion.' }, 400);
	}

	const idArray = ids.split(',').map((id) => {
		return new ObjectId(id);
	});
	const result = await (await db).collection('logs').deleteMany({ _id: { $in: idArray } });

	if (result.deletedCount > 0) {
		return json({ success: true, message: 'Logs deleted successfully.' });
	} else {
		return json({ success: false, message: 'Logs not found or already deleted.' }, 404);
	}
}
