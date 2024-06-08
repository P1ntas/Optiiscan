import os
import json
from difflib import SequenceMatcher, ndiff
from collections import defaultdict

def get_differences(str1, str2):
    diff = list(ndiff(str1.split(), str2.split()))
    differences = [d for d in diff if d.startswith("- ") or d.startswith("+ ")]
    return differences

def similarity_score(str1, str2):
    score = SequenceMatcher(None, str1, str2).ratio()
    differences = get_differences(str1, str2)
    return score, differences

def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)
    
def save_json(data, file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

# Compare simple fields, nutritional table, ingredients and informative text
def compare_jsons(json1, json2):
    simple_fields = ["name", "brand", "code"]
    simple_comparison_scores = {
        field: 1 if json1[field].lower() == json2[field].lower() else 0 for field in simple_fields
    }

    nutritional_table_scores = {}
    nutritional_table_fields = json1["nutritional_table"].keys()
    for field in nutritional_table_fields:
        fields1 = [str(value).replace(" ", "").replace("%", "").replace(".", ",").replace("None", "").replace("null", "").replace("-", "").replace("g", "") for value in json1["nutritional_table"][field].values()]
        fields2 = []
        if json2["nutritional_table"].get(field):
            for value in json2["nutritional_table"][field].values():
                fields2.append(str(value).replace(" ", "").replace("%", "").replace(".", ",").replace("None", "").replace("null", "").replace("-", "").replace("g", ""))
            field_scores = []
            for i in range(len(fields1)):
                try:
                    if fields1[i] == fields2[i]:
                        field_scores.append(1)
                    else:
                        field_scores.append(0)
                except IndexError:
                    field_scores.append(0)
            nutritional_table_scores[field] = sum(field_scores) / len(field_scores) if field_scores else 0
        else:
            nutritional_table_scores[field] = 0

    try:
        ingredients_score, ingredients_diff = similarity_score(json1["ingredients"], json2["ingredients"])
    except KeyError:
        ingredients_score = 0
        ingredients_diff = ["KeyError"]

    informative_text_scores = {}
    informative_text_diffs = {}
    informative_text_fields = json1["informative_text"].keys()
    for field in informative_text_fields:
        try:
            score, diff = similarity_score(json1["informative_text"][field], json2["informative_text"][field])
            informative_text_scores[field] = score
            informative_text_diffs[field] = diff
        except KeyError:
            informative_text_scores[field] = 0
            informative_text_diffs[field] = ["KeyError"]

    all_scores = list(simple_comparison_scores.values()) + list(nutritional_table_scores.values()) + [ingredients_score] + list(informative_text_scores.values())
    
    average_score = sum(all_scores) / len(all_scores)

    comparison_details = {
        **{f"{field}_score": score for field, score in simple_comparison_scores.items()},
        **{f"{field}_score": score for field, score in nutritional_table_scores.items()},
        "ingredients_score": ingredients_score,
        "ingredients_diff": ingredients_diff,
        **{f"{field}_score": score for field, score in informative_text_scores.items()},
        **{f"{field}_diff": diffs for field, diffs in informative_text_diffs.items()},
    }
    
    return average_score, comparison_details

def compare_files_in_folder(folder_path, model):
    files = os.listdir(folder_path)
    grouped_files = defaultdict(list)

    for file in files:
        if file.endswith(".json"):
            prefix = file.split("-")[0]
            grouped_files[prefix].append(file)
    
    total_score = 0
    comparison_count = 0
    results = {}
    label_accuracies = defaultdict(list)
    
    for prefix, file_group in grouped_files.items():
        true_file = f"{prefix}-true.json"
        if true_file in file_group:
            true_json = load_json(os.path.join(folder_path, true_file))
            for file in file_group:
                if file != true_file and model in file:
                    comparison_json = load_json(os.path.join(folder_path, file))
                    score, comparison_details = compare_jsons(true_json, comparison_json)
                    results[file] = {
                        "average_score": score,
                        "details": comparison_details
                    }
                    total_score += score
                    comparison_count += 1

                    for label, accuracy in comparison_details.items():
                        if "_score" in label:
                            label_name = label.replace("_score", "")
                            label_accuracies[label_name].append(accuracy)

                    print(f"Comparison between {true_file} and {file}: {score}")
    
    if comparison_count > 0:
        average_score = total_score / comparison_count
    else:
        average_score = 0
    
    label_accuracies_avg = {label: sum(scores) / len(scores) for label, scores in label_accuracies.items()}
    results["total_average_score"] = average_score
    results["total_label_accuracies"] = label_accuracies_avg

    print(f"Average similarity score of all comparisons: {average_score}")
    print(f"Label accuracies: {label_accuracies_avg}")

    average_score_path = os.path.join("output", f"{model}_result.json")
    save_json(results, average_score_path)
    
    return results, average_score

folder_path = "jsons/"
compare_files_in_folder(folder_path, "gemini")
compare_files_in_folder(folder_path, "gpt4v")
