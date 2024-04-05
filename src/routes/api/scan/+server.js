import { scanPrompt } from '$lib/server/openai';

export async function POST({ request }) {
	const params = await request.json();
	const filepaths = params.filePaths;
	const batchSize = 2;
	console.log(filepaths);

	/**@type {Array<ScanObject>}*/
	let response = [];
	for (let i = 0; i < filepaths.length; i += batchSize) {
		try {
			await scanPrompt(filepaths.slice(i, i + batchSize)).then((res) => {
				if (!res) throw TypeError('Response is null');
				response.push(...res);
			});
		} catch (err) {
			return new Response(JSON.stringify([{ error: `Scanning raised an error: ${err}` }]));
		}
	}
	return new Response(JSON.stringify(response));
}
