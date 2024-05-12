import sharp from 'sharp';
import { fromPath } from 'pdf2pic';
import path from 'path';
import fs from 'fs-extra';

/**
 * Read an image and divide it into equal parts along the width/length, whichever is bigger.
 * @param {string} path the path to the image
 * @param {number} divisions the number of divisions
 * @returns {Promise<string[]>} filepaths
 */
export async function divideImage(path, divisions) {
	/**@type Promise<string>[]*/
	const promises = [];
	return new Promise((resolve) =>
		sharp(path)
			.metadata()
			.then((metadata) => {
				if (metadata.height && metadata.width) {
					const vertical = metadata.height > metadata.width;
					const partHeight = Math.floor(metadata.height / divisions);
					const partWidth = Math.floor(metadata.width / divisions);

					for (let i = 0; i < divisions; i++) {
						const newPath = path.replace('.png', `_${i + 1}.png`);
						const promise = new Promise((resolve) => {
							sharp(path)
								.extract({
									top: vertical ? i * partHeight : 0,
									left: !vertical ? i * partWidth : 0,
									width: vertical ? metadata.width ?? 0 : partWidth,
									height: !vertical ? metadata.height ?? 0 : partHeight
								})
								.toFile(newPath, (err, info) => {
									if (err) {
										console.error(err);
										resolve(err);
									} else {
										console.log(info);
										resolve(newPath);
									}
								});
						});
						promises.push(promise);
					}
				}
				Promise.all(promises).then((results) => {
					console.log('results: ', results);
					resolve(results);
				});
			})
	);
}

/**
 * Convert a PDF file to a PNG image, with the best quality possible.
 * @param {string} filepath the path to the PDF file
 * @returns a promise which, when resolved, yields the path to the created PNG image.
 */
export async function pdfToPng(filepath) {
	const fileInfo = path.parse(filepath);
	console.log('converting pdf ', filepath);
	console.log('save path: ', fileInfo.dir);
	const options = {
		quality: 100,
		width: 3347,
		height: 3347,
		preserveAspectRatio: true,
		saveFilename: fileInfo.name,
		savePath: fileInfo.dir,
		density: 150,
		format: 'png',
		compression: 'Lossless'
	};

	const convert = fromPath(filepath, options);

	return new Promise((resolve) => {
		if (['.jpeg', '.jpg', '.png'].includes(fileInfo.ext.toLowerCase())) resolve(filepath);
		else
			convert(1)
				.then((response) => {
					console.log(response);
					resolve(response.path);
				})
				.catch((error) => {
					console.log(error);
				});
	});
}

export function deleteScanFile(filepath) {
	const formats = ['.png', '.pdf', '.jpg'];

	for (const format of formats) {
		const filename =
			path.basename(filepath).endsWith('.1.png') && format === '.pdf'
				? path.basename(filepath).replace('.1.png', '')
				: path.parse(filepath).name;
		const fullFilePath = `${path.dirname(filepath)}/${filename}${format}`;

		try {
			console.log(`File being deleted: ${fullFilePath}`);
			fs.unlinkSync(fullFilePath);
		} catch (err) {
			if (err.code === 'ENOENT') {
				console.log(`File not found: ${fullFilePath}`);
			} else {
				throw err;
			}
		}
	}
}
