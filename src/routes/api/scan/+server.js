import { scanPrompt } from '$lib/server/openai';
import { divideImage } from '$lib/server/utils';

export async function POST({ request }) {
	const params = await request.json();
	return Promise.all(
		params.filePaths.map(async (/**@type string*/ path) => {
			return await divideImage(path, 3);
		})
	)
		.then(async (filepaths) => {
			filepaths = filepaths.flat();
			const batchSize = 5;
			console.log('after promise: ', filepaths);
			/**@type {Array<ScanObject>}*/
			let response = [];
			for (let i = 0; i < filepaths.length; i += batchSize) {
				try {
					await scanPrompt(filepaths.slice(i, i + batchSize)).then((res) => {
						if (!res) throw TypeError('Response is null');
						response.push(...res);
					});
				} catch (err) {
					return new Response(
						JSON.stringify([{ error: `Scanning raised an error: ${err}` }])
					);
				}
			}
			return new Response(JSON.stringify(response));
		})
		.catch((err) => {
			return new Response(JSON.stringify(err));
		});
}
