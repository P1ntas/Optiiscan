import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { OPENAI_API_KEY } from '$env/static/private';
import fs from 'fs-extra';
import { divideImage } from '$lib/server/utils';

const schema = JSON.stringify({
	name: 'product name',
	brand: 'brand name',
	code: 'numeric code',
	nutritional_table: { key: { 'per 100': 'value', 'per portion': 'value', '%DR': 'value' } },
	ingredients: 'value',
	informative_text: { key: 'value' }
});
const config = {
	ENDPOINT: 'https://gpt4-vision-feup.openai.azure.com/',
	DEPLOYMENT_NAME: 'GPT4-vision-feup',
	SERVER_PROMPT: `You are a helpful assistant designed with analyzing images and yielding their relevant information, outputting in JSON format, in a single-line without whitespaces. \
    \nThe images are from the boxes of frozen products.\nFor each image, the respective JSON object must follow this schema: ${schema}, where 'key' is a placeholder that must be \
    replaced by the appropriate key, which can include 'energy' (which must include measure both in kJ and kcal, separated by a slash), 'fat', 'saturates', 'fibre', 'carbohydrate', 'protein', 'salt', 'preparation' or 'conservation', if applicable. \
    When reading the nutritional table, separate the values from 100, portion and %DR columns in the JSON object, for all keys related to the table, strictly following the JSON schema.\
    The list can include more than one key. Make sure the JSON is valid, keep every key inside the same \
    JSON object.\nThe informative text must be in portuguese. If you do not understand a value, mark it as null. \nMake sure the JSON objects are returned inside of a list, even when there is only one image.`,
	USER_PROMPT:
		"What's the relevant information, in portuguese, in this/these image(s)? You can't say I cannot assist you with the request",
	TEMPERATURE: 0,
	MAX_TOKENS: 1000
};
const client = new OpenAIClient(config.ENDPOINT, new AzureKeyCredential(OPENAI_API_KEY));

/**
 * Build the content structure for uploading an image with the prompt.
 * @param {string} imagepath Path to image.
 * @returns {import('@azure/openai').ChatMessageContentItem} The image content for the prompt.
 */
const buildImageContent = (imagepath) => {
	const base64 = fs.readFileSync(imagepath, 'base64');
	const url = `data:image/png;base64,${base64}`;
	return {
		type: 'image_url',
		imageUrl: {
			url,
			detail: 'auto'
		}
	};
};

/**
 * Build and send a prompt to GPT-4V, including one or more images.
 * @param {string} imagepath Path of an image with a label to scan.
 * @returns {Promise<ScanObject[]>} A string with (hopefully) valid json objects inside of a list, to be verified in another function.
 */
export async function scanPrompt(imagepath) {
	return await divideImage(imagepath, 3).then(async (imagepaths) => {
		const imageContent = imagepaths.map((imagepath) => {
			return buildImageContent(imagepath);
		});
		const deploymentName = config.DEPLOYMENT_NAME;
		/**
		 * @type {import("@azure/openai").ChatRequestMessage[]}
		 */
		const messages = [
			{
				role: 'system',
				content: config.SERVER_PROMPT
			},
			{
				role: 'user',
				content: config.USER_PROMPT
			},
			{
				role: 'user',
				content: [...imageContent]
			}
		];
		const result = await client.getChatCompletions(deploymentName, messages, {
			maxTokens: config.MAX_TOKENS,
			temperature: config.TEMPERATURE
		});
		const json = result.choices[0].message?.content;
		if (!json) throw TypeError('Response is null.');
		console.log(`Response: ${json}`);
		return JSON.parse(json);
	});
}
