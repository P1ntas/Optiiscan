import fs from 'fs-extra';
import { VertexAI } from '@google-cloud/vertexai';
import { GCLOUD_PROJECT_ID } from '$env/static/private';
import { PROMPT } from '$lib/server/ai-models';

const location = 'us-central1';
const model = 'gemini-1.0-pro-vision-001';

const vertexAI = new VertexAI({ project: GCLOUD_PROJECT_ID, location: location });

const generativeVisionModel = vertexAI.getGenerativeModel({
	model: model
});

/**
 * Build and send a prompt to Gemini, including an image.
 * @param {string} imagepath Path of an image with a label to scan.
 * @returns {Promise<ScanObject[]>} A string with (hopefully) valid json objects inside of a list.
 */
export async function scanPrompt(imagepath) {
	const base64Image = fs.readFileSync(imagepath, 'base64');
	/**@type {import('@google-cloud/vertexai').Part} */
	const filePart = { inlineData: { data: base64Image, mimeType: 'image/jpeg' } };
	const textPart = { text: PROMPT };
	/**@type {import('@google-cloud/vertexai').GenerateContentRequest} */
	const request = {
		contents: [{ role: 'user', parts: [textPart, filePart] }]
	};
	const streamingResult = await generativeVisionModel.generateContentStream(request);
	for await (const item of streamingResult.stream) {
		console.log('stream chunk: ', JSON.stringify(item));
	}
	const contentResponse = await streamingResult.response;
	const json = contentResponse.candidates
		? contentResponse.candidates[0].content.parts[0].text
		: '';
	if (!json) throw TypeError('Response is null.');
	console.log(`Response: ${json}`);
	try {
		return JSON.parse(json);
	} catch (e) {
		throw Error(`Generated JSON is invalid! ${e}\n${json}`);
	}
}
