import { json } from '@sveltejs/kit';
import db from '../../../lib/server/db/db';

export async function GET() {
	return json(await (await db).collection('products').find().toArray());
}
