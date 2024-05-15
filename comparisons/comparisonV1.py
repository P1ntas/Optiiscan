import json

# JSON strings for each model's output and the true values
gemini_15_data = '[{"name":"Batatas Steakhouse","brand":"Continente","code":"5601312078104","nutritional_table":{"energy":{"per 100":"533kJ/128kcal","per portion":"null","%DR":"null"},"fat":{"per 100":"6.5g","per portion":"null","%DR":"9"},"saturates":{"per 100":"0.7g","per portion":"null","%DR":"4"},"carbohydrate":{"per 100":"17g","per portion":"null","%DR":"7"},"fibre":{"per 100":"3.2g","per portion":"null","%DR":"13"},"protein":{"per 100":"2.2g","per portion":"null","%DR":"4"},"salt":{"per 100":"0.3g","per portion":"null","%DR":"5"}},"ingredients":"null","informative_text":{"preparation":"Após descongelação, fritar em óleo quente (175ºC), durante 3-5 minutos até ficarem douradas e crocantes.","conservation":"Conservar a -18ºC até à data limite de validade indicada na embalagem. Uma vez descongelado, não voltar a congelar. Após descongelação, conservar no frigorífico e consumir no próprio dia."}}]'
gemini_10_data = '[{"name":"Batatas Steakhouse","brand":"Continente","code":"5601320781048","nutritional_table":{"energy":{"per 100":"893 kJ / 213 kcal","per portion":"447 kJ / 107 kcal","%DR":"5-3%"},"fat":{"per 100":"9.0 g","per portion":"4.5 g","%DR":"7-1%"},"saturates":{"per 100":"1.3 g","per portion":"0.7 g","%DR":"5-3%"},"carbohydrate":{"per 100":"31 g","per portion":"16 g","%DR":"5-3%"},"sugars":{"per 100":"0.3 g","per portion":"0.2 g","%DR":"0-1%"},"fibre":{"per 100":"2.9 g","per portion":"1.5 g","%DR":"6-3%"},"protein":{"per 100":"2.1 g","per portion":"1.1 g","%DR":"2-1%"},"salt":{"per 100":"0.81 g","per portion":"0.41 g","%DR":"7-2%"}},"ingredients":"Batatas (79%), óleo de girassol (5%), amido de batata (2%), farinha de arroz (2%), dextrose, sal, regulador de acidez (difosfatos), antioxidante (tocoferol).","informative_text":{"preparation":"Fritar em óleo abundante durante 3 a 4 minutos.","conservation":"Conservar a -18 ºC ou mais frio."}}]'
chatgpt_4o_data = '[{"name":"Batatas Steakhouse","brand":"Continente","code":"5601312078104","nutritional_table":{"energy":{"per 100":"504kJ/120kcal","per portion":"756kJ/179kcal","%DR":"9%"},"fat":{"per 100":"2.5g","per portion":"3.8g","%DR":"5%"},"saturates":{"per 100":"0.3g","per portion":"0.5g","%DR":"3%"},"carbohydrate":{"per 100":"21.9g","per portion":"32.9g","%DR":"13%"},"sugars":{"per 100":"0.2g","per portion":"0.3g","%DR":"<1%"},"fibre":{"per 100":"1.9g","per portion":"2.9g","%DR":"12%"},"protein":{"per 100":"2.3g","per portion":"3.5g","%DR":"7%"},"salt":{"per 100":"0.04g","per portion":"0.06g","%DR":"1%"}},"ingredients":"Batatas (97%), óleo de girassol (3%).","informative_text":{"preparation":"Frite as batatas fritas congeladas em óleo quente (175°C) durante 3-5 minutos até dourar e ficarem crocantes. Os tempos ideais de fritura variam de acordo com a tonalidade e a crocância desejados. Tempere a gosto.","conservation":"Conservar a -18°C até ao limite de prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não voltar a congelar."}}]'
chatgpt_4_data = '[{"name":"Batatas Steakhouse","brand":"Continente","code":"5601312078104","nutritional_table":{"energy":{"per 100":"504 kJ/120 kcal","per portion":"756 kJ/180 kcal","%DR":"9%"},"fat":{"per 100":"2.5 g","per portion":"3.8 g","%DR":"5%"},"saturates":{"per 100":"0.3 g","per portion":"0.5 g","%DR":"3%"},"carbohydrate":{"per 100":"21 g","per portion":"31 g","%DR":"12%"},"sugar":{"per 100":"0.2 g","per portion":"0.3 g","%DR":"<1%"},"fibre":{"per 100":"1.9 g","per portion":"2.9 g","%DR":"-"},"protein":{"per 100":"2.3 g","per portion":"3.5 g","%DR":"7%"},"salt":{"per 100":"0.04 g","per portion":"0.06 g","%DR":"1%"}},"ingredients":"Batatas (97%), óleo de girassol (3%)","informative_text":{"preparation":"Sem descongelar, fritar em óleo quente (175°C) por cerca de 3-5 minutos até dourar e ficar crocante.","conservation":"Conservar a -18°C até ao limite do prazo de validade indicado na embalagem. Uma vez iniciado o processo de descongelação, não voltar a congelar."}}]'
true_values = '{"name":"Batatas Steakhouse","brand":"Continente","code":"5601312078104","nutritional_table":{"energy":{"per 100":"504 kJ/120 kcal","per portion":"null","%DR":"null"},"fat":{"per 100":"2.5g","per portion":"null","%DR":"9"},"saturates":{"per 100":"0.3g","per portion":"null","%DR":"4"},"carbohydrate":{"per 100":"21g","per portion":"null","%DR":"7"},"fibre":{"per 100":"1.9g","per portion":"null","%DR":"13"},"protein":{"per 100":"2.3g","per portion":"null","%DR":"4"},"salt":{"per 100":"0.04g","per portion":"null","%DR":"5"}},"ingredients":"null","informative_text":{"preparation":"Após descongelação, fritar em óleo quente (175ºC), durante 3-5 minutos até ficarem douradas e crocantes.","conservation":"Conservar a -18ºC até à data limite de validade indicada na embalagem. Uma vez descongelado, não voltar a congelar. Após descongelação, conservar no frigorífico e consumir no próprio dia."}}'
# Load the JSON data
gemini_15 = json.loads(gemini_15_data)
gemini_10 = json.loads(gemini_10_data)
chatgpt_4o = json.loads(chatgpt_4o_data)
chatgpt_4 = json.loads(chatgpt_4_data)
true = json.loads(true_values)

def compare_data(model_data, true_data):
    model_results = model_data[0]  # Assuming only one item in the list for simplicity
    true_results = true_data
    attributes = ['name', 'brand', 'code', 'ingredients']
    nutritional_attributes = ['per 100', 'per portion', '%DR']
    info_attributes = ['preparation', 'conservation']

    total_correct = 0
    total_checks = 0

    # Compare basic attributes
    for attr in attributes:
        if model_results.get(attr, None) == true_results.get(attr, None):
            total_correct += 1
        total_checks += 1

    # Compare nutritional information
    for nutrient, values in true_results['nutritional_table'].items():
        if nutrient in model_results['nutritional_table']:
            for attr in nutritional_attributes:
                if values.get(attr, None) == model_results['nutritional_table'][nutrient].get(attr, None):
                    total_correct += 1
                total_checks += 1

    # Compare informative text
    for attr in info_attributes:
        if model_results['informative_text'].get(attr, None) == true_results.get(attr, None):
            total_correct += 1
        total_checks += 1

    accuracy = total_correct / total_checks
    return accuracy * 100

# Compare each model against the true values
accuracies = {
    "Gemini 1.5": compare_data(gemini_15, true),
    "Gemini 1.0": compare_data(gemini_10, true),
    "ChatGPT 4o": compare_data(chatgpt_4o, true),
    "ChatGPT 4": compare_data(chatgpt_4, true)
}

print("Accuracy of Models:")
for model, accuracy in accuracies.items():
    print(f"{model}: {accuracy:.2f}%")
