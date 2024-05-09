import { pdfToPng } from '$lib/server/utils';
import { scanPrompt } from '$lib/server/ai-models/gemini';

export async function POST({ request }) {
	const params = await request.json();
	console.log(params);
	return Promise.all(
		params.filePaths.map(async (/**@type string*/ path) => {
			return await pdfToPng(path);
		})
	)
		.then(async (filepaths) => {
			console.log('after promise: ', filepaths);
			/**@type {Array<ScanObject>}*/
			let response = [];
			for (let i = 0; i < filepaths.length; i++) {
				try {
					await scanPrompt(filepaths[i]).then((res) => {
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
