import { scanPrompt } from '$lib/server/openai';
import { pdfToPng } from '$lib/server/utils';
import { divideImage } from '$lib/server/utils';
import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
	const params = await request.json();
	return Promise.all(
		params.filePaths.map(async (/**@type string*/ path) => {
			return await pdfToPng(path);
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
						fs.writeFile(
							`src/output/gpt_cropped_${path.basename(filepaths[0]).replace('png', 'json')}`,
							JSON.stringify(response),
							{ mode: 0o777 },
							() => {}
						);
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
