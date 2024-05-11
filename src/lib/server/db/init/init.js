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

/*
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
*/

db.products.insertMany([
	// eslint-disable-line
	{
		name: 'Batatas Steakhouse',
		brand: 'Continente',
		code: '5601312078104',
		nutritional_table: {
			energy: {
				'per 100': '504 kJ / 120 kcal',
				'per portion': '756 kJ / 179 kcal',
				'%DR': '9%'
			},
			fat: {
				'per 100': '2,5 g',
				'per portion': '3,8 g',
				'%DR': '5%'
			},
			saturates: {
				'per 100': '0,3 g',
				'per portion': '0,5 g',
				'%DR': '2%'
			},
			carbohydrate: {
				'per 100': '21 g',
				'per portion': '31 g',
				'%DR': '12%'
			},
			sugars: {
				'per 100': '0,2 g',
				'per portion': '0,3 g',
				'%DR': '<1%'
			},
			fibre: {
				'per 100': '1,9 g',
				'per portion': '2,9 g',
				'%DR': null
			},
			protein: {
				'per 100': '2,3 g',
				'per portion': '3,5 g',
				'%DR': '7%'
			},
			salt: {
				'per 100': '0,04 g',
				'per portion': '0,06 g',
				'%DR': '1%'
			}
		},
		ingredients: 'Batatas (97%), óleo de girassol (3%)',
		informative_text: {
			preparation:
				'Frite as batatas fritas congeladas em óleo quente (175°C) durante 3-5 minutos até dourar e ficarem crocantes. Os tempos ideais de fritura variam de acordo com a tonalidade e a crocância desejados. Tempere a gosto.',
			conservation:
				'Conservar a -18°C até ao limite do prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não volte a congelar.'
		},
		uploadTime: '2024-05-09T21:12:48.570Z'
	},
	{
		name: 'Bolo de Bolacha',
		brand: 'Continente',
		code: '5601312139638',
		nutritional_table: {
			energy: {
				'per 100': '1625kJ/390kcal',
				'per portion': '1625kJ/390kcal',
				'%DR': '19'
			},
			fat: {
				'per 100': '24g',
				'per portion': '24g',
				'%DR': '35'
			},
			saturates: {
				'per 100': '11g',
				'per portion': '11g',
				'%DR': '53'
			},
			carbohydrate: {
				'per 100': '37g',
				'per portion': '37g',
				'%DR': '14'
			},
			sugar: {
				'per 100': '19g',
				'per portion': '19g',
				'%DR': '21'
			},
			fibre: {
				'per 100': '2,3g',
				'per portion': '2,3g',
				'%DR': null
			},
			protein: {
				'per 100': '4,2g',
				'per portion': '4,2g',
				'%DR': '8'
			},
			salt: {
				'per 100': '1,20g',
				'per portion': '1,20g',
				'%DR': '20'
			}
		},
		ingredients:
			'Bolacha (46%) [farinha de trigo, açúcar, gordura de palma, xarope de glicose-frutose, levedante (E500ii, E503ii), corante (E150d (contém sulfitos)), sal, emulsionante (E322 (contém soja)), antioxidante (E223 (contém sulfitos)), ovos pasteurizados, creme vegetal (óleo de colza parcialmente hidrogenado, gordura de palma parcialmente hidrogenada, água, sal, emulsionante (E322 (contém soja), E471, E475), antioxidante (E320, E310), aroma, regulador de acidez (E300)], açúcar, canela, café, amêndoa. Pode conter vestígios de leite.',
		informative_text: {
			preparation:
				'Antes de consumir, descongelar durante 60 minutos à temperatura ambiente. Depois de descongelado conservar o produto no frigorífico e consumir no período máximo de 7 dias.',
			conservation:
				'Conservar a -18°C até ao limite do prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não volte a congelar.'
		},
		uploadTime: '2024-05-09T21:24:57.493Z'
	},
	{
		name: 'Rissóis de Camarão',
		brand: 'Continente',
		code: '6099',
		nutritional_table: {
			energy: {
				'per 100': '964 kJ / 230 kcal',
				'per portion': '868 kJ / 207 kcal',
				'%DR': '10%'
			},
			fat: {
				'per 100': '9,8 g',
				'per portion': '8,8 g',
				'%DR': '13%'
			},
			saturates: {
				'per 100': '1,3 g',
				'per portion': '1,2 g',
				'%DR': '6%'
			},
			carbohydrate: {
				'per 100': '29 g',
				'per portion': '26 g',
				'%DR': '10%'
			},
			sugars: {
				'per 100': '1,9 g',
				'per portion': '1,7 g',
				'%DR': '2%'
			},
			fibre: {
				'per 100': '1,9 g',
				'per portion': '1,7 g',
				'%DR': null
			},
			protein: {
				'per 100': '5,5 g',
				'per portion': '5,0 g',
				'%DR': '10%'
			},
			salt: {
				'per 100': '1,30 g',
				'per portion': '1,17 g',
				'%DR': '20%'
			}
		},
		ingredients:
			'Massa (52%): água, farinha de trigo, gordura de suíno, aroma de limão e sal. Recheio (40%): camarão (30%)(contém crustáceos), água, farinha de trigo, leite em pó, cebola (contém sulfitos), óleo vegetal de girassol, tomate, sal, salsa, azeite e especiarias. Panagem (8%): pão ralado (farinha de trigo, água, açúcar, levedura e sal), água, farinha de trigo, soro lácteo, regulador de acidez (E500) e sal.',
		informative_text: {
			preparation:
				'Sem descongelar, em forno pré-aquecido (180-190 °C), colocar o produto em tabuleiros e levar ao forno aproximadamente 5-7 minutos até ficarem douradinhos. Deve ser garantida a temperatura de 75 °C no centro térmico do produto.',
			conservation:
				'Conservar a -18 °C até ao limite do prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não volte a congelar.'
		},
		uploadTime: '2024-05-09T21:26:04.316Z'
	},
	{
		name: 'Arroz Basmati Cozido com Mistura de Legumes, Frango Assado e Ovo Mexido',
		brand: 'Continente',
		code: '600',
		nutritional_table: {
			energy: {
				'per 100': '583 kJ / 138 kcal',
				'per portion': '1748 kJ / 414 kcal',
				'%DR': '21%'
			},
			fat: {
				'per 100': '3,0 g',
				'per portion': '8,9 g',
				'%DR': '13%'
			},
			saturates: {
				'per 100': '0,5 g',
				'per portion': '1,4 g',
				'%DR': '7%'
			},
			carbohydrate: {
				'per 100': '21,1 g',
				'per portion': '63,3 g',
				'%DR': '24%'
			},
			sugars: {
				'per 100': '1,5 g',
				'per portion': '4,4 g',
				'%DR': '5%'
			},
			fibre: {
				'per 100': '0,8 g',
				'per portion': '2,3 g'
			},
			protein: {
				'per 100': '6,4 g',
				'per portion': '19 g',
				'%DR': '38%'
			},
			salt: {
				'per 100': '0,90 g',
				'per portion': '2,7 g',
				'%DR': '45%'
			}
		},
		ingredients:
			'Arroz basmati cozido (53%) (água, arroz basmati), frango marinado assado (11%) (frango, água, amido, dextrose, sal), ovos mexidos (6%) (ovos, água, farinha de milho, sal, sumo de limão concentrado), molho de soja (4%) (água, soja, sal, farinha de trigo, álcool de cana-de-açúcar), milho (3%), alho-francês (3%), cebola (3%), grãos de soja (3%), cenoura (2%), ervilhas (1)%, óleo de sésamo, óleo de girassol, vinho tinto, água, vinagre de arroz (água, vinagre de arroz (água, arroz)), alho, açúcar amarelo, gengibre, sal, pimenta branca, espessante (goma xantana).',
		informative_text: {
			preparation:
				'Frigideira: Pré-aqueça uma frigideira antiaderente a temperatura média-alta. Sem descongelar, coloque o conteúdo da embalagem na frigideira e cozinhe durante 6 a 7 minutos, mexendo sempre, até o produto ficar bem cozido. Micro-ondas: Sem descongelar, coloque o conteúdo da embalagem num recipiente próprio para micro-ondas e cozinhe a 900W durante cerca de 6 minutos. Mexa e cozinhe novamente durante 2 minutos. O tempo de confeção pode variar consoante o equipamento utilizado. Necessita de cozedura completa antes do seu consumo.',
			conservation:
				'Conservar a -18°C até ao limite do prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não volte a congelar.',
			consumption: 'Consumir de preferência antes do fim de: (ver verso da embalagem).'
		},
		uploadTime: '2024-05-09T21:26:55.967Z'
	},
	{
		name: 'Pato Desfiado Com Chouriço e Bacon',
		brand: 'Continente',
		code: '5601312502388',
		nutritional_table: {
			energy: {
				'per 100': '566 kJ / 136 kcal',
				'per portion': '849 kJ / 204 kcal',
				'%DR': '10'
			},
			fat: {
				'per 100': '8,8 g',
				'per portion': '13,3 g',
				'%DR': '19'
			},
			saturates: {
				'per 100': '2,4 g',
				'per portion': '3,7 g',
				'%DR': '18'
			},
			carbohydrate: {
				'per 100': '<0,5 g',
				'per portion': '<0,8 g',
				'%DR': '<1'
			},
			sugars: {
				'per 100': '<0,5 g',
				'per portion': '<0,8 g',
				'%DR': '<1'
			},
			protein: {
				'per 100': '13 g',
				'per portion': '20 g',
				'%DR': '40'
			},
			salt: {
				'per 100': '0,55 g',
				'per portion': '0,82 g',
				'%DR': '14'
			}
		},
		ingredients:
			'Água de cozedura do pato, carne de pato cozida (40%), cebola, azeite, chouriço (4,3%) [carne e gordura de suíno, tecido conjuntivo de suíno, massa de pimentão (pimento e sal), sal, massa de alho (alho e sal), especiarias, açúcar, emulsionante (difosfatos), conservante (nitrito de sódio), corante (extrato de pimentão)] e bacon (3,3%) [entremeada de suíno, água, regulador de acidez (lactato de potássio), sal, xarope de glicose, emulsionantes (trifosfatos, difosfatos e polifosfatos), antioxidante (eritorbato de sódio) e conservantes (acetatos de sódio e nitrito de sódio)]. Este produto é fabricado com pato, pelo que, apesar da escolha rigorosa, pontualmente pode conter algum osso. Pode conter vestígios de glÚten, crustáceos, ovos, peixes, amendoins, soja, leite, frutos de casca rija, aipo, mostarda, sementes de sésamo, sulfitos, tremoço e moluscos.',
		informative_text: {
			preparation:
				'Várias preparações possíveis de acordo com a imaginação do consumidor. Necessita de cozedura completa antes de consumo.',
			conservation:
				'Conservar a -18°C até ao limite do prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não volte a congelar.'
		},
		uploadTime: '2024-05-09T21:35:58.357Z'
	}
]);
