import { json } from '@sveltejs/kit';
import db from '../../../../lib/server/db/db';

export async function GET() {
	const data = {
		name: 'Product Name',
		brand: 'Continente',
		barcode: ['1234567890123'],
		description: 'Product description',
		nutritional_table: {
			energy: {
				'per 100':
					Math.round(Math.random() * 100) +
					'kJ / ' +
					Math.round(Math.random() * 100) +
					'kcal',
				'per portion':
					Math.round(Math.random() * 100) +
					'kJ / ' +
					Math.round(Math.random() * 100) +
					'kcal',
				'%DR': Math.round(Math.random())
			},
			fat: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			},
			saturates: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			},
			carbohydrate: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			},
			sugars: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			},
			fibre: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			},
			protein: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			},
			salt: {
				'per 100': Math.round(Math.random() * 100) + 'g',
				'per portion': Math.round(Math.random() * 100) + 'g',
				'%DR': Math.round(Math.random())
			}
		},
		ingredients: ['Ingredient 1', 'Ingredient 2'],
		informative_text: {
			preperation: 'Preperation text',
			conservation: 'Conservation text'
		},
		labels: ['Vegan', 'Gluten-Free', 'Non- GMO']
	};

	try {
		await (await db).collection('products').insertOne(data);
		return json({ success: true, message: 'Document inserted successfully.' });
	} catch (error) {
		return json({ success: false, error: error.message });
	}
}
