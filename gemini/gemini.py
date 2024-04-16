import subprocess
import json
import base64
import tempfile

image_path = '../static/test/products/file_3.png'
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

json_data = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "You are a helpful assistant designed with analyzing images and yielding their relevant information, outputting in JSON format, in a single-line without whitespaces. \"\"\"\nThe images are from the boxes of frozen products. \nFor each image, the JSON must include an object with the field \"name\" (name of the product), \"nutritional declaration\", which has several lines and is structured in a table format: The table has 3 columns: per 100g, per portion and %DR. The lines of the table are Energy, Fat, Carbohydrate, fibre, protein and salt. The nutritional table has multiple lines and columns, please make sure to include all the information.\nPlease do not invent values, use the information that is present in the image, if you do not understand a value mark it as null. Values vertically aligned are in the same column \"\"\" \nThe object should also include the ingredients listed in the \"INGREDIENTS\" section of the image. Please extract icons from the image and derive their meaning as a \"icons\" attribute in the object. \nThese icons should have a meaning associated. if you cant understand the meaning write it in json anyway and have meaning as null. \nMake sure the JSON objects are returned inside of a list, even when there is only one image.\nWhat's the name and nutritional table like in this/these image(s)? You can't say I cannot assist you with the request."
                },
                {
                    "inlineData": {
                        "mimeType": "image/png",
                        "data": encoded_string
                    }
                },
            ]
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 2048,
        "topP": 0.4,
        "topK": 32,
    },
}

with tempfile.NamedTemporaryFile(delete=False, mode='w+', suffix='.json') as temp_file:
    json.dump(json_data, temp_file)
    temp_file_path = temp_file.name

json_string = json.dumps(json_data)

api_endpoint = "us-central1-aiplatform.googleapis.com"
project_id = "engaged-hash-420315"
location_id = "us-central1"
model_id = "gemini-1.0-pro-vision-001"
url = f"https://{api_endpoint}/v1/projects/{project_id}/locations/{location_id}/publishers/google/models/{model_id}:streamGenerateContent"

curl_command = f"curl -X POST -H \"Authorization: Bearer $(gcloud auth print-access-token)\" -H \"Content-Type: application/json\" {url} -d @{temp_file_path}"

process = subprocess.Popen(curl_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, text=True)
stdout, stderr = process.communicate()

if process.returncode == 0:
    data = json.loads(stdout)

    texts = []

    for item in data:
        candidates = item['candidates']
        for candidate in candidates:
            parts = candidate['content']['parts']
            for part in parts:
                texts.append(part['text'])

    print(texts)
else:
    print("Failed to execute curl command:", stderr)
