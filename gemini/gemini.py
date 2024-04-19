import subprocess
import json
import base64
import tempfile
import os

image_path = '../static/test/products/file_6.png'

with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
schema = json.dumps({"name": "product name", "nutritional_table": {"key": {"per 100g": "value", "per portion": "value", "%DR": "value"}}, "ingredients": "value", "informative_text": {"key": "value"}})
json_data = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": f"You are a helpful assistant designed with analyzing images and yielding their relevant information, outputting in JSON format, in a single-line without whitespaces. \"\"\"\nThe images are from the boxes of frozen products.\nFor each image, the respective JSON object must follow this schema: {schema}, where 'key' is a placeholder that must be replaced by the appropriate key, which can include 'energy', 'fat', 'saturates', 'fibre', 'carbohydrate', 'protein', 'salt', 'preparation' or 'conservation', if applicable. The 'energy' category must include measure in kJ and kcal, separated by a slash. The list can include more than one key. Make sure the JSON is valid, keep every key inside the same JSON object.\nIf you do not understand a value, mark it as null. \nMake sure the JSON objects are returned inside of a list, even when there is only one image. \nWhat's the relevant information, in portuguese, in this/these image(s)? You can't say I cannot assist you with the request."
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
        "topP": 0.2,
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

    results = ''.join(texts).strip()
    print(results)
    with open(f'output/results.json', 'w') as file:
        file.write(results.encode().decode('unicode-escape'))
else:
    print("Failed to execute curl command:", stderr)
