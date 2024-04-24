import sharp from 'sharp';
import { fromPath } from 'pdf2pic';
import path from 'path';

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
	console.log('converting pdf ', filepath);
	console.log('save path: ', path.dirname(filepath));
	const options = {
		quality: 100,
		width: 3347,
		height: 3347,
		preserveAspectRatio: true,
		saveFilename: path.parse(filepath).name,
		savePath: path.dirname(filepath),
		density: 150,
		format: 'png',
		compression: 'Lossless'
	};

	const convert = fromPath(filepath, options);

	return new Promise((resolve) => {
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
