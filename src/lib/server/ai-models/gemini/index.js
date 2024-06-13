import fs from 'fs-extra';
import { VertexAI } from '@google-cloud/vertexai';
import { GCLOUD_PROJECT_ID } from '$env/static/private';

const location = 'us-central1';
const model = 'gemini-1.0-pro-vision-001';

const vertexAI = new VertexAI({ project: GCLOUD_PROJECT_ID, location: location });

const generativeVisionModel = vertexAI.getGenerativeModel({
	model: model
});

const schema = JSON.stringify({
	name: 'product name',
	brand: 'brand name',
	code: 'numeric code',
	nutritional_table: { key: { 'per 100': 'value', 'per portion': 'value', '%DR': 'value' } },
	ingredients: 'value',
	informative_text: { key: 'value' }
});
const config = {
	PROMPT: `You are a helpful assistant designed with analyzing images and yielding their relevant information, outputting in JSON format, in a single-line without whitespaces. \
    \nThe images are from the boxes of frozen products.\nFor each image, the respective JSON object must follow this schema: ${schema}, where 'key' is a placeholder that must be \
    replaced by the appropriate key, which can include 'energy' (which must include measure both in kJ and kcal, separated by a slash), 'fat', 'saturates', 'fibre', 'carbohydrate', 'sugars', 'protein', 'salt', 'preparation' or 'conservation', if applicable. \
    When reading the nutritional table, separate the values from 100, portion and %DR columns in the JSON object, for all keys related to the table, strictly following the JSON schema.\
    The list can include more than one key. Make sure the JSON is valid, keep every key inside the same \
    JSON object.\nThe informative text must be in portuguese. If you do not understand a value, mark it as null. \nMake sure the JSON objects are returned inside of a list, even when there is only one image.\
    \nWhat's the relevant information, in portuguese, in this/these image(s)?`
};

/**
 * Build and send a prompt to Gemini, including an image.
 * @param {string} imagepath Path of an image with a label to scan.
 * @returns {Promise<ScanObject[]>}A string with (hopefully) valid json objects inside of a list, to be verified in another function.
 */
export async function scanPrompt(imagepath) {
	const base64Image = fs.readFileSync(imagepath, 'base64');
	/**@type {import('@google-cloud/vertexai').Part} */
	const filePart = { inlineData: { data: base64Image, mimeType: 'image/jpeg' } };
	const textPart = { text: config.PROMPT };
	/**@type {import('@google-cloud/vertexai').GenerateContentRequest} */
	const request = {
		contents: [{ role: 'user', parts: [textPart, filePart] }]
	};
	const streamingResult = await generativeVisionModel.generateContentStream(request);
	const contentResponse = await streamingResult.response;
	const json = contentResponse.candidates
		? contentResponse.candidates[0].content.parts[0].text
		: '';
	if (!json) throw TypeError('Response is null.');
	console.log(`Response: ${json}`);
	return JSON.parse(json);
}
