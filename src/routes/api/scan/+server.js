import { pdfToPng } from '$lib/server/utils';
import { scanPrompt } from '$lib/server/ai-models/gemini';
import db from '$lib/server/db/db';

/**
 * @param {number} numImages
 */
async function createLog(db, numImages) {
	const response = await db.collection('logs').insertOne({
		status: 'running',
		uploadDate: new Date().toISOString(),
		finishDate: undefined,
		elapsedTime: undefined,
		numImages: numImages,
		infoCorrect: 0,
		infoError: 0,
		info: []
	});
	return response['insertedId'];
}

export async function POST({ request }) {
	const params = await request.json();
	console.log(params);

	let _db = await db;
	let log = await createLog(_db, params.filePaths.length);
	let startTime = new Date().getTime();

	let success = 0;
	let error = 0;
	let messages = [];

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
					await scanPrompt(filepaths[i]).then(async (res) => {
						if (!res) throw TypeError('Response is null');
						console.log(res);

						res[0]['uploadTime'] = new Date().toISOString();
						_db.collection('products').insertOne(res[0]);

						success += 1;
						messages.push(
							`${new Date().toLocaleTimeString()} - ${filepaths[i]} scanned with success`
						);
						response.push(...res);
					});
				} catch {
					messages.push(`${new Date().toLocaleTimeString()} - ${filepaths[i]} failed`);
					error += 1;
				}

				_db.collection('logs').updateOne(
					{ _id: log },
					{
						$set: {
							infoCorrect: success,
							infoError: error,
							info: messages
						}
					}
				);
			}
			_db.collection('logs').updateOne(
				{ _id: log },
				{
					$set: {
						status: 'completed',
						finishDate: new Date().toISOString(),
						elapsedTime:
							((new Date().getTime() - startTime) / 1e3 / 60).toFixed(2) + ' minutes'
					}
				}
			);
			return new Response(JSON.stringify(response));
		})
		.catch((err) => {
			_db.collection('logs').updateOne({ _id: log }, { $set: { status: 'aborted' } });
			return new Response(JSON.stringify(err));
		});
}
