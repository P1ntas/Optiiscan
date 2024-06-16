const SCHEMA = JSON.stringify({
	name: 'product name',
	brand: 'brand name',
	code: 'numeric code',
	nutritional_table: { key: { 'per 100': 'value', 'per portion': 'value', '%DR': 'value' } },
	ingredients: 'value',
	informative_text: { key: 'value' }
});

export const SERVER_PROMPT = `You are a helpful assistant designed with analyzing images and yielding their relevant information, outputting in JSON format, in a single-line without whitespaces. \
The images are from the boxes of frozen products. For each image, the respective JSON object must follow this schema: ${SCHEMA}, where 'key' is a placeholder that must be \
replaced by the appropriate key, which can include 'energy' (which must include measure both in kJ and kcal, separated by a slash), 'fat', 'saturates', 'fibre', 'carbohydrate', \
'sugars', 'protein', 'salt', 'preparation' or 'conservation', if applicable. When reading the nutritional table, separate the values from 100, portion and %DR columns in the JSON \
object, for all keys related to the table, strictly following the JSON schema. The list can include more than one key. Make sure the JSON is valid, keep every key inside the same \
JSON object. The informative text must be in portuguese. If you do not understand a value, or the value is empty, mark it as "none". \
Make sure the JSON objects are returned inside of a list, even when there is only one image.`;
export const USER_PROMPT =
	"What's the relevant information, in portuguese, in this/these image(s)?";
export const PROMPT = `${SERVER_PROMPT}\n${USER_PROMPT}`;
