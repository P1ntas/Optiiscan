import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { OPENAI_API_KEY } from '$env/static/private';
import fs from 'fs-extra';

const config = {
	ENDPOINT: 'https://gpt4-vision-feup.openai.azure.com/',
	DEPLOYMENT_NAME: 'GPT4-vision-feup',
	SERVER_PROMPT:
		'You are a helpful assistant designed with analyzing images and yielding their relevant information, \
	outputting in JSON format, in a single-line without whitespaces. For each image, the JSON must include an object with \
	the names "title" (a title that fits the image), "description" (short, one sentence description) and "color" (the predominant color in the image).\
	Make sure the JSON objects are returned inside of a list, even when there is only one image.',
	USER_PROMPT: "What's the landscape like in this/these image(s)?",
	TEMPERATURE: 0,
	MAX_TOKENS: 100
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
 * @param {string[]} imagepaths List of paths of images with labels to scan.
 * @returns {Promise<ScanObject[]>}A string with (hopefully) valid json objects inside of a list, to be verified in another function.
 */
export async function scanPrompt(imagepaths) {
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
}
