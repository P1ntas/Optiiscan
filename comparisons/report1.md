# Testing between Models

In this report, I will compare the performance of different models on different products and describe our methodology for testing the models. The models we will be testing are:

-   <b>Gemini 1.5</b>
-   <b>Gemini 1.0</b>
-   <b>ChatGPT 4</b>
-   <b>ChatGPT 4o</b>

In order to perform the comparison, we used 3 products. Each product's image was divided into 3 separate images, zoomed in, in order to improve the model's performance. The prompt used was the same as in the deployed website.

In order to know the true values of the products to compare to, we created a JSON for each product with the real values registered. After that, we created a Python script to compare the real values with the predicted values of the models. For that, we compare field by field, and then calculate the percentage of correct predictions. Each field is valued the same, so, for example, if the field "preparation" has 1 error, it'll count as much as if the field "sugars: per 100g" has its numerical value wrong. We also need to correct some formatting before running the comparison script, as the models don't always output the same format as the real values (for example, some models introduce a space between the number of fields and the kJ unit, others do not).

# Future Work

To improve our testing methodology, we want to increase the number of products tested to at least 10. This process takes a long time, as we have to register the correct values by hand, as such we can't have the scalability we wished. We also pretend to introduce error weighting to our comparisons, such that a small error on the preparation description isn't discounted as heavily.
