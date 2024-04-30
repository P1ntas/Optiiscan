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

// =========================================================================
// =========================================================================
// =========================================================================

db.products.insertMany([
	// eslint-disable-line
	{
		uploadTime: '2023-07-15T10:30',
		code: '987654321',
		name: 'Organic Chocolate Bar',
		description:
			'Indulge in the rich, creamy taste of our organic chocolate bar. Made from the finest cocoa beans sourced from sustainable farms, each bite offers a luxurious blend of sweetness and depth. Whether you savor it on its own or use it as a decadent addition to your favorite desserts, our chocolate bar is sure to delight your senses and satisfy your cravings.',
		labels: ['Organic', 'Fair Trade', 'Vegan']
	},
	{
		uploadTime: '2023-09-28T16:45',
		code: '123456789',
		name: 'Spicy Jalapeno Chips',
		description:
			'Experience a fiery burst of flavor with our spicy jalapeno chips. Crafted from premium potatoes and seasoned with an irresistible blend of spices, each chip delivers a perfect balance of heat and crunch. Whether you enjoy them as a zesty snack on-the-go or pair them with your favorite dip, our jalapeno chips are sure to add a kick to any occasion.',
		labels: ['Spicy', 'Gluten-Free', 'Non-GMO']
	},
	{
		uploadTime: '2024-02-10 08:15',
		code: '246810975',
		name: 'Coconut Bliss Granola',
		description:
			'Indulge in a tropical escape with our coconut bliss granola. Packed with toasted coconut flakes, crunchy almonds, and juicy dried fruits, each spoonful transports you to paradise. Whether you enjoy it with yogurt for a wholesome breakfast or sprinkle it over ice cream for a decadent dessert, our granola is a delightful treat any time of day.',
		labels: ['Gluten-Free', 'Organic', 'Vegan']
	},
	{
		uploadTime: '2024-03-20 14:00',
		code: '135792468',
		name: 'Honey Roasted Cashews',
		description:
			'Satisfy your cravings with our honey roasted cashews. Each cashew is coated in a golden honey glaze and oven-roasted to perfection, resulting in a sweet and crunchy snack thats impossible to resist. Whether you enjoy them on their own or sprinkle them over salads for added crunch, our cashews are sure to be a hit with everyone.',
		labels: ['Gluten-Free', 'Non-GMO']
	},
	{
		uploadTime: '2024-04-25 11:30',
		code: '369258147',
		name: 'Blueberry Greek Yogurt',
		description:
			'Indulge in the creamy goodness of our blueberry Greek yogurt. Made with thick, velvety yogurt and ripe, juicy blueberries, each spoonful is a burst of fruity flavor and probiotic goodness. Whether you enjoy it as a quick breakfast on-the-go or a refreshing snack between meals, our Greek yogurt is a delicious way to fuel your day.',
		labels: ['Probiotic', 'High Protein']
	}
]);
