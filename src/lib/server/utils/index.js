import sharp from 'sharp';

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
