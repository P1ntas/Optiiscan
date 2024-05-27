import os
import json
from difflib import SequenceMatcher
from collections import defaultdict

def similarity_score(str1, str2):
    return SequenceMatcher(None, str1, str2).ratio()

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
    
def save_json(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

# Compare simple fields, nutritional table, ingredients and informative text
def compare_jsons(json1, json2):
    simple_fields = ["name", "brand", "code"]
    simple_comparison_scores = [
        1 if json1[field].lower() == json2[field].lower() else 0 for field in simple_fields
    ]
    
    nutritional_table_fields = json1["nutritional_table"].keys()
    for field in nutritional_table_fields:
        fields1 = [str(value).replace(" ", "").replace("%", "").replace(".", ",").replace("None", "").replace("null", "").replace("-", "").replace("g", "") for value in json1["nutritional_table"][field].values()]
        fields2 = []
        if json2["nutritional_table"].get(field):
            for value in json2["nutritional_table"][field].values():
                fields2.append(str(value).replace(" ", "").replace("%", "").replace(".", ",").replace("None", "").replace("null", "").replace("-", "").replace("g", ""))
            for i in range(0, len(fields1)):
                try:
                    if fields1[i] == fields2[i]:
                        simple_comparison_scores.append(1)
                    else:
                        simple_comparison_scores.append(0)
                except IndexError:
                    simple_comparison_scores.append(0)
        else:
            print("Field not present!")
            simple_comparison_scores.extend([0]*len(json1["nutritional_table"][field].values()))
    
    print("Simple fields: ", simple_comparison_scores)

    try:
        ingredients_score = similarity_score(json1["ingredients"], json2["ingredients"])
    except KeyError:
        ingredients_score = 0
    
    informative_text_fields = json1["informative_text"].keys()
    informative_text_scores = []
    for field in informative_text_fields:
        try:
            informative_text_scores.append(similarity_score(json1["informative_text"][field], json2["informative_text"][field]))
        except KeyError:
            informative_text_scores.append(0)
    
    all_scores = simple_comparison_scores + [ingredients_score] + informative_text_scores
    
    print("All scores: ", all_scores)
    
    average_score = sum(all_scores) / len(all_scores)
    
    return average_score

def compare_files_in_folder(folder_path, model):
    files = os.listdir(folder_path)
    grouped_files = defaultdict(list)

    for file in files:
        if file.endswith('.json'):
            prefix = file.split('-')[0]
            grouped_files[prefix].append(file)
    
    total_score = 0
    comparison_count = 0
    results = {}
    
    # Compare each model output file with the corresponding "true" file, for each product
    for prefix, file_group in grouped_files.items():
        true_file = f"{prefix}-true.json"
        if true_file in file_group:
            true_json = load_json(os.path.join(folder_path, true_file))
            for file in file_group:
                if file != true_file and model in file:
                    comparison_json = load_json(os.path.join(folder_path, file))
                    score = compare_jsons(true_json, comparison_json)
                    results[file] = score
                    total_score += score
                    comparison_count += 1
                    print(f'Comparison between {true_file} and {file}: {score}')
                    result_path = os.path.join("output", f"{os.path.basename(file).split('.')[0]}_result.json")
                    save_json({file: score}, result_path)
    
    if comparison_count > 0:
        average_score = total_score / comparison_count
    else:
        average_score = 0
    
    print(f'Average similarity score of all comparisons: {average_score}')
    average_score_path = os.path.join("output", f"{model}_result.json")
    save_json({"average_score": average_score}, average_score_path)
    return results, average_score

folder_path = 'jsons/'
compare_files_in_folder(folder_path, "gemini")
compare_files_in_folder(folder_path, "gpt4v")