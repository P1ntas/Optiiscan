/**
 * Initialize database with mock data
 *
 * TO COMMENT FOR PRODUCTION
 */

const logStatus = ['running', 'completed', 'aborted'];
const logsMessages = [
	'Started process...',
	'Image X finished...',
	'Error on Image Y',
	'Completed',
	'Process interrupted...',
	'Image X failed to process...'
];

const getRandomDate = (start, end) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const startDate = new Date('2024-01-01');
const endDate = new Date();

const logs = Array.from({ length: 25 }, () => {
	const status = logStatus[Math.floor(Math.random() * logStatus.length)];
	const uploadDate = getRandomDate(startDate, endDate);
	const numImages = Math.floor(Math.random() * 1000) + 1000;
	const infoCorrect = Math.floor(numImages * 0.9);
	const infoError = numImages - infoCorrect;
	let finishDate, elapsedTime;

	if (status === 'completed') {
		finishDate = getRandomDate(uploadDate, endDate);
		elapsedTime = Math.floor((finishDate - uploadDate) / (1000 * 60)) + ' minutes';
	}

	const info = Array.from({ length: 17 }, () => {
		const randomIndex = Math.floor(Math.random() * logsMessages.length);
		return `${uploadDate.toISOString()} - ${logsMessages[randomIndex]}`;
	});

	return {
		status,
		uploadDate: uploadDate.toISOString(),
		finishDate: finishDate ? finishDate.toISOString() : undefined,
		elapsedTime,
		numImages,
		infoCorrect,
		infoError,
		info
	};
});

db.logs.insertMany(logs); // eslint-disable-line
