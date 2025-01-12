import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { OPENAI_API_KEY } from '$env/static/private';
import fs from 'fs-extra';
import { divideImage } from '$lib/server/utils';
import { SERVER_PROMPT, USER_PROMPT } from '$lib/server/ai-models';

const config = {
	ENDPOINT: 'https://gpt4-vision-feup.openai.azure.com/',
	DEPLOYMENT_NAME: 'GPT4-vision-feup',
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
				content: SERVER_PROMPT
			},
			{
				role: 'user',
				content: USER_PROMPT
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
		try {
			return JSON.parse(json);
		} catch (e) {
			throw Error(`Generated JSON is invalid! ${e}\n${json}`);
		}
	});
}
