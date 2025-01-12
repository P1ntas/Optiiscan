<script>
	import { onMount, setContext } from 'svelte';
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, Button } from 'flowbite-svelte';
	import {
		DownloadSolid,
		EditOutline,
		SortOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';
	import NutritionTable from '../../components/NutritionTable.svelte';
	import EditProduct from '../../components/EditProduct.svelte';
	import InformativeText from '../../components/InformativeText.svelte';
	import Ingredients from '../../components/Ingredients.svelte';
	import { error, success } from '../../toasts';

	// Initialize selectedFilters with an empty array
	let selectedFilters = [];
	let appliedFilters = [];

	/**
	 * @type {any[]}
	 */
	let products = [];

	let nutritionTable = {
		show: false,
		product: '',
		data: {}
	};

	let othersModal = {
		show: false,
		product: '',
		data: {}
	};

	let ingredientsModal = {
		show: false,
		product: '',
		data: ''
	};

	let editModal = {
		show: false,
		product: '',
		data: {}
	};

	async function fetchProducts() {
		return await fetch('/api/products').then((res) => res.json());
	}

	async function applyFilters() {
		// Retrieve the original list of products from the database
		products = await fetchProducts();

		// Update the selectedFilters array with the filters that were applied
		selectedFilters = appliedFilters.slice();

		// Filter products based on selected labels or ingredients
		const filteredProducts = products.filter((product) => {
			if (selectedFilters.length === 0) {
				return true; // Show all products if no filters are selected
			} else if (selectedFilters.length === 1) {
				const labelMatch =
					product.labels &&
					selectedFilters.every((filter) => product.labels.includes(filter));
				const ingredientMatch =
					product.ingredients &&
					selectedFilters.every((filter) => product.ingredients.includes(filter));
				const brandMatch =
					product.brand &&
					selectedFilters.every((filter) => product.brand.includes(filter));
				// Include the product if it matches all selected labels or ingredients or brands
				return labelMatch || ingredientMatch || brandMatch;
			} else {
				// Check if the product matches all selected filters
				const matches = selectedFilters.every((filter) => {
					const labelMatch = product.labels && product.labels.includes(filter);
					const ingredientMatch =
						product.ingredients && product.ingredients.includes(filter);
					const brandMatch = product.brand && product.brand.includes(filter);
					return labelMatch || ingredientMatch || brandMatch;
				});
				return matches;
			}
		});

		// Update the displayed products
		products = filteredProducts;

		console.log('Applied filters:', appliedFilters);

		// Close the filter popup after applying filters
		isFilterPopupOpen = false;
	}

	onMount(async () => {
		products = await fetchProducts();
		labelFilters = fetchLabelFilters(products);
		ingredientFilters = fetchIngredientFilters(products);
		brandFilters = fetchBrandFilters(products);
	});

	function fetchLabelFilters(products) {
		let labels = [];
		products.forEach((product) => {
			if (product.labels) {
				labels = labels.concat(product.labels.filter((label) => !labels.includes(label)));
			}
		});
		return labels;
	}

	function fetchIngredientFilters(products) {
		let ingredients = [];
		products.forEach((product) => {
			if (product.ingredients) {
				const productIngredients = product.ingredients
					.split(/,|:|\.|\(|\)|\[|\]|\b\d+\b|%|\bcontém\b|\bPode conter\b|(?<!\S)e(?!\S)/)
					.map((ingredient) => ingredient.trim());
				productIngredients.forEach((ingredient) => {
					if (
						ingredient !== '' &&
						ingredient.toLowerCase() !== 'contém' &&
						ingredient.toLowerCase() !== 'pode conter' &&
						ingredient.toLowerCase() !== 'e'
					) {
						// Exclude empty strings, "contém", "Pode conter", and "e"
						if (!ingredients.includes(ingredient)) {
							ingredients.push(ingredient);
						}
					}
				});
			}
		});
		return ingredients;
	}

	function fetchBrandFilters(products) {
		let brands = [];
		products.forEach((product) => {
			if (product.brand && !brands.includes(product.brand)) {
				brands.push(product.brand);
			}
		});
		return brands;
	}

	// Function to toggle the filter popup
	let isFilterPopupOpen = false;

	function toggleFilterPopup() {
		isFilterPopupOpen = !isFilterPopupOpen;
	}

	// Function to toggle a filter
	function toggleFilter(filter) {
		const isSelected = appliedFilters.includes(filter);
		if (isSelected) {
			appliedFilters = appliedFilters.filter((f) => f !== filter);
		} else {
			appliedFilters.push(filter);
		}
	}

	async function fetchProductsByCode(codes) {
		try {
			const response = await fetch('/api/products/by-code', {
				method: 'POST', // Using POST to send the list of codes
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ codes: codes.join(',') }) // Pass the codes as a comma-separated list
			});

			if (response.ok) {
				const products = await response.json();
				console.log('Products with given codes:', products);
				return products;
			} else {
				console.error('Failed to fetch products by code:', response.status);
			}
		} catch (error) {
			console.error('Error fetching products by code:', error);
		}
	}

	// Function to toggle a filter
	function toggleFilterButton(filter) {
		const index = appliedFilters.indexOf(filter);
		if (index !== -1) {
			appliedFilters.splice(index, 1);
		} else {
			appliedFilters.push(filter);
		}
		// Update selectedFilters array
		selectedFilters = appliedFilters.slice();
		// Apply filters immediately
		applyFilters();
	}

	// Function to delete all filters
	function deleteAllFilters() {
		appliedFilters = [];
		selectedFilters = [];
		applyFilters();
	}

	// Function to handle search
	async function search(event) {
		products = await fetchProducts();

		let searchText = event.detail.searchText;
		let category = event.detail.category;
		console.log('Searching for:', searchText, 'in category:', category);

		// Send search query to backend API
		const response = await fetch(`/api/products?searchText=${searchText}&category=${category}`);
		if (response.ok) {
			const filteredProducts = products.filter((product) => {
				return product.name.toLowerCase().includes(searchText.toLowerCase());
			});
			products = filteredProducts;
			console.log('Search successful', products);
		} else {
			console.error('Failed to fetch products:', response.statusText);
		}
	}

	function convertToCSV(data) {
		if (!data.length) {
			return '';
		}

		const headers = Object.keys(data[0]); // Get CSV headers from the first object
		const csvRows = [];

		// Add headers to the CSV
		csvRows.push(headers.join(','));

		// Add rows
		data.forEach((row) => {
			const values = headers.map((header) => {
				const val = row[header];

				// If the value is an object, convert it to a JSON string
				if (typeof val === 'object' && val !== null) {
					return `"${JSON.stringify(val).replace(/"/g, '""')}"`; // Escape double quotes
				}

				// Otherwise, handle as a normal value
				return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val; // Escape double quotes
			});

			csvRows.push(values.join(',')); // Join values with commas
		});

		return csvRows.join('\n'); // Join rows with newline characters
	}

	async function downloadCSV() {
		let selectedProductsCodes = getCheckedProducts();
		console.log('SelectedProducts: ', selectedProductsCodes);
		// TODO: Add here code to download CSV (dont forget to send the selected products)

		if (selectedProductsCodes.length === 0) {
			console.log('No products selected.');
			return; // Nothing to download
		}

		// Fetch the products by their codes
		const products = await fetchProductsByCode(selectedProductsCodes);

		if (!products.length) {
			console.log('No products found.');
			return;
		}

		const uniqueProducts = products
			.filter(
				(product, index, self) => index === self.findIndex((t) => t.code === product.code)
			)
			.map((product) => product);

		// Convert product data to CSV format
		const csvData = convertToCSV(uniqueProducts);

		if (csvData === '') {
			console.log('No data to create CSV.');
			return;
		}

		const bom = '\uFEFF'; // This represents the UTF-8 BOM
		const csvWithBom = bom + csvData;

		// Now create a Blob with the modified CSV data that includes the UTF-8 BOM
		const csvBlob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });

		// Create a temporary anchor element to trigger download
		const fileUrl = URL.createObjectURL(csvBlob); // Create a downloadable URL
		const link = document.createElement('a');
		link.href = fileUrl;
		link.setAttribute('download', 'output.csv'); // Set the download filename

		// Trigger the download
		document.body.appendChild(link);
		link.click(); // Simulate a click to download
		document.body.removeChild(link);

		// Clean up the object URL to avoid memory leaks
		URL.revokeObjectURL(fileUrl);
	}

	// Function to toggle all checkboxes
	let headerChecked = true;

	function setCheckboxesByCode(codes) {
		document.querySelectorAll('input[type=checkbox].lineCheckBox').forEach((checkbox) => {
			const id = checkbox.id.substring(checkbox.id.indexOf('-') + 1);
			console.log('check: ', codes, id, codes.includes(id));
			checkbox.checked = codes.includes(id);
		});
	}

	function toggleAll() {
		headerChecked = !headerChecked;
		document.querySelectorAll('input[type=checkbox].lineCheckBox').forEach((checkbox) => {
			checkbox.checked = headerChecked;
		});
	}

	// Function to toggle a single checkbox
	function toggleCheckbox(event) {
		if (!event.target.checked) {
			headerChecked = false;
		}
	}

	/**
	 * @param {number} index
	 */
	function openNutritionTable(index) {
		nutritionTable['product'] = products[index].name;
		nutritionTable['data'] = products[index].nutritional_table;
		nutritionTable['show'] = true;
	}

	/**
	 * @param {number} index
	 */
	function openOthersModal(index) {
		othersModal['product'] = products[index].name;
		othersModal['data'] = products[index].informative_text;
		othersModal['show'] = true;
	}

	/**
	 * @param {number} index
	 */
	function openIngredientsModal(index) {
		ingredientsModal['product'] = products[index].name;
		ingredientsModal['data'] = products[index].ingredients;
		ingredientsModal['show'] = true;
	}

	/**
	 * @param {number} index
	 */
	function openEditModal(index) {
		editModal['product'] = products[index].name;
		editModal['data'] = products[index];
		editModal['show'] = true;
	}

	/**
	 *
	 * @param {number} index
	 */
	async function deleteProduct(index) {
		console.log(JSON.stringify(index));
		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(products[index]._id)
		};
		try {
			const response = await fetch('/api/products', options);
			await response.json().then(async (res) => {
				console.log(res);
				if (res.success) success('Record deleted succesfully.');
				else error('An error occurred deleting the record.');
				products = await fetchProducts();
			});
		} catch {
			error('Something went wrong!');
		}
	}

	function getCheckedProducts() {
		/**
		 * @type {string[]}
		 */
		let selectedProductsCodes = [];
		document.querySelectorAll('input[type=checkbox].lineCheckBox').forEach((checkbox) => {
			if (checkbox.checked) {
				const id = checkbox.id.substring(checkbox.id.indexOf('-') + 1);
				selectedProductsCodes.push(id);
			}
		});
		return selectedProductsCodes;
	}

	const sortFunctions = {
		code: (a, b) => parseInt(a.code) - parseInt(b.code),
		name: (a, b) => a.name < b.name,
		brand: (a, b) => a.brand < b.brand
	};

	let recordsOrder = 0;
	function sortRecords(func) {
		console.log('Sorting records');
		console.log(
			Array.from(document.querySelectorAll('input[type=checkbox].lineCheckBox'), (a) => a.id)
		);
		const selectedProductsCodes = getCheckedProducts();
		if (recordsOrder === 0) {
			recordsOrder = 1;
			products = products.sort(func);
		} else {
			recordsOrder = 0;
			products = products.sort(func).reverse();
		}
		// Reordering products doesn't reorder checkboxes to match the products. This is a hotfix
		setTimeout(() => {
			setCheckboxesByCode(selectedProductsCodes);
		}, 100);
	}

	// Default label and ingredient filters
	let labelFilters = [];
	let ingredientFilters = [];
	let brandFilters = [];

	// Context API to share data between components
	setContext('selectedFilters', selectedFilters);
</script>

<div class="flex-column flex">
	<Nav page="records" />
	<main class="flex-1 p-10">
		<SearchBar on:search={search} />
		<hr class="my-7 h-px border-0 bg-black bg-opacity-10" />
		<div class="flex flex-wrap">
			<Heading tag="h3" class="w-full text-black">Products</Heading><br />
			<div class="flex flex-wrap">
				{#if selectedFilters.length > 0}
					{#each selectedFilters as filter}
						<div class="mt-2 flex" style="margin-right: 7px;">
							<button
								style="background-color: #f5f5f5; border: none; padding: 5px 20px; border-radius: 40px; cursor: pointer;color: gray;"
								on:click={() => toggleFilterButton(filter)}
							>
								<span style="margin-right: 5px;">×</span>
								{filter}
							</button>
						</div>
					{/each}
				{/if}
			</div>
			<div class="mt-2 flex" style="margin-right: 7px;">
				<button
					on:click={toggleFilterPopup}
					style="background-color: #f5f5f5; border: none; padding: 5px 20px; border-radius: 40px; cursor: pointer;"
				>
					<span style="margin-right: 5px;">+</span>
					Add Filter
				</button>
			</div>
			<div class="flex flex-wrap">
				{#if selectedFilters.length > 0}
					<div class="mt-2 flex">
						<button
							style="background-color: #f5f5f5; border: none; padding: 5px 20px; border-radius: 40px; cursor: pointer; display: flex; align-items: center;"
							on:click={deleteAllFilters}
						>
							<span style="margin-right: 5px;">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="15"
									height="15"
									viewBox="0 0 24 24"
								>
									<path
										d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"
									/>
								</svg>
							</span>
							Delete All Filters
						</button>
					</div>
				{/if}
			</div>
			<div class="ml-auto mt-2 flex">
				<Button on:click={downloadCSV} color="red" size="md" class="w-40">
					<DownloadSolid class="me-2 h-4 w-4" />
					Export CSV
				</Button>
			</div>
		</div>
		<br />
		<p>Showing <span class="font-bold">{products.length} products</span></p>

		<div class="table-container" style="overflow-x: visible;">
			<table class="mt-10 w-full text-left text-sm text-gray-500 dark:text-gray-400">
				<thead
					class="styled-thead"
					style="background-color: #f8fafc; position: sticky; top: 0; z-index: 10;"
				>
					<tr>
						<th
							class="whitespace-nowrap !p-3 px-6 py-4 font-medium text-gray-900 dark:text-white"
							style="border-bottom: 1px solid #d2d6dc;"
						>
							<Checkbox
								on:click={toggleAll}
								class="text-primary  focus:outline-primary"
								bind:checked={headerChecked}
							/>
						</th>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
						>
							<div class="flex gap-2 align-middle">
								Code
								<button
									type="button"
									on:click={() => sortRecords(sortFunctions['code'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div></th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
						>
							<div class="flex gap-2 align-middle">
								Name
								<button
									type="button"
									on:click={() => sortRecords(sortFunctions['name'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div></th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
						>
							<div class="flex gap-2 align-middle">
								Brand
								<button
									type="button"
									on:click={() => sortRecords(sortFunctions['brand'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div></th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
							>Nutrition Table</th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
							>Ingredients</th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
							>Others</th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
							>Labels</th
						>
						<th
							class="font-light; whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
							style="font-size: 0.75rem;font-weight: 500;color: #4b5563;text-transform: uppercase;border-bottom: 1px solid #d2d6dc;"
						>
							<span class="sr-only">
								<EditOutline class="h-6 w-6" />
							</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each products as product, index}
						<tr
							class="border-b bg-white last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
						>
							<td
								class="whitespace-nowrap !p-3 px-6 py-4 font-medium text-gray-900 dark:text-white"
							>
								<Checkbox
									checked={true}
									on:click={toggleCheckbox}
									id="checkbox-{product.code}"
									class="lineCheckBox  text-primary focus:outline-primary"
								/>
							</td>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
								>{product.code}</td
							>
							<td
								class="whitespace-nowrap text-wrap px-6 py-4 font-light text-gray-900 dark:text-white"
								>{product.name}</td
							>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<div class="text-wrap">
									{#if product.brand && product.brand.length > 0}
										{product.brand}
									{:else}
										No brand available
									{/if}
								</div></td
							>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<Button
									class="text-black"
									style="display: block;"
									on:click={() => {
										openNutritionTable(index);
									}}>Show</Button
								>
							</td>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<Button
									class="text-black"
									style="display: block;"
									on:click={() => {
										openIngredientsModal(index);
									}}>Show</Button
								>
							</td>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<Button
									class="text-black"
									style="display: block;"
									on:click={() => {
										openOthersModal(index);
									}}>Show</Button
								>
							</td>
							<td
								class="whitespace-nowrap text-wrap px-6 py-4 font-light text-gray-900 dark:text-white"
								>{product.labels ? product.labels : '-'}</td
							>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
								><button
									on:click={() => {
										openEditModal(index);
									}}
									class="text-primary-600"
								>
									<EditOutline class="h-6 w-6" />
								</button></td
							>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
								><button
									on:click={() => {
										deleteProduct(index);
									}}
									class="text-primary-600"
								>
									<TrashBinOutline class="h-6 w-6 text-secondary" />
								</button></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if !products.length}
			<Heading tag="h5" class="w-100 mt-5 text-center">
				No products found, try to upload a image...
			</Heading>
		{/if}

		<NutritionTable
			bind:show={nutritionTable.show}
			bind:product={nutritionTable.product}
			bind:data={nutritionTable.data}
		/>

		<InformativeText
			bind:show={othersModal.show}
			bind:product={othersModal.product}
			bind:data={othersModal.data}
		/>

		<Ingredients
			bind:show={ingredientsModal.show}
			bind:product={ingredientsModal.product}
			bind:data={ingredientsModal.data}
		/>

		<EditProduct
			bind:show={editModal.show}
			bind:product={editModal.product}
			bind:data={editModal.data}
			on:refreshProducts={async () => {
				products = await fetchProducts();
			}}
		/>

		<div
			class="fixed left-0 top-0 z-50 h-full w-full bg-black bg-opacity-50"
			hidden={!isFilterPopupOpen}
		>
			<div
				class="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded bg-white p-5 shadow-lg"
			>
				<h2 class="mb-4 text-xl font-bold">Filters</h2>
				<!-- Categories -->
				<div class="mb-4">
					<h3 class="mb-2 text-lg font-bold">Labels</h3>
					{#each labelFilters as label}
						<label for={`filter-${label}`} class="mr-4 flex items-center">
							<Checkbox
								type="checkbox"
								id={`filter-${label}`}
								class="mr-2 text-primary focus:outline-primary"
								checked={selectedFilters.includes(label)}
								on:change={() => toggleFilter(label)}
							/>
							{label}
						</label>
					{/each}
				</div>
				<div class="mb-4">
					<h3 class="mb-2 text-lg font-bold">Ingredients</h3>
					<div class="max-h-48 overflow-y-auto">
						{#each ingredientFilters as ingredient}
							<label for={`filter-${ingredient}`} class="mr-4 flex items-center">
								<Checkbox
									type="checkbox"
									id={`filter-${ingredient}`}
									class="mr-2 text-primary focus:outline-primary"
									checked={selectedFilters.includes(ingredient)}
									on:change={() => toggleFilter(ingredient)}
								/>
								{ingredient}
							</label>
						{:else}
							<p>No ingredients available</p>
						{/each}
					</div>
				</div>
				<div class="mb-4">
					<h3 class="mb-2 text-lg font-bold">Brand</h3>
					<div class="max-h-48 overflow-y-auto">
						{#each brandFilters as brand}
							<label for={`filter-${brand}`} class="mr-4 flex items-center">
								<Checkbox
									type="checkbox"
									id={`filter-${brand}`}
									class="mr-2 text-primary focus:outline-primary"
									checked={selectedFilters.includes(brand)}
									on:change={() => toggleFilter(brand)}
								/>
								{brand}
							</label>
						{:else}
							<p>No brands available</p>
						{/each}
					</div>
				</div>

				<!-- Apply and Cancel Buttons -->
				<div class="flex justify-end">
					<button class="mr-2 text-gray-500 hover:underline" on:click={toggleFilterPopup}>
						Cancel
					</button>
					<button
						class="text-primary-600 bg-primary-100 rounded px-3 py-2 hover:underline"
						on:click={applyFilters}
					>
						Apply Filters
					</button>
				</div>
			</div>
		</div>
	</main>
</div>
