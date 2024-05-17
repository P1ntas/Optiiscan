import { json } from '@sveltejs/kit';
import db from '../../../../lib/server/db/db';

/**
 * Fetch products by code
 */

export async function POST({ request }) {
  const { codes } = await request.json();
  if (!codes) {
    return json({ success: false, message: 'No product codes provided.' }, 400);
  }

  // Convert comma-separated codes into an array
  const codeArray = codes.split(',').map((code) => code.trim());

  const products = await (await db).collection('products').find({ code: { $in: codeArray } }).toArray();

  return json(products);
}
