<script>
	import { onMount, setContext } from 'svelte';
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, P, Button, Modal, Textarea, Input, Label } from 'flowbite-svelte';
	import { DownloadSolid, EditOutline } from 'flowbite-svelte-icons';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';

	let modalIndex;
	let modalMode = 'view'; // 'view' or 'edit'
	let showModal = null;

	function toggleModal(index, mode) {
		modalMode = mode;
		modalIndex = index;
		showModal = true;
		document.body.style.overflow = 'hidden';
	}

	function closeModal() {
		showModal = false;
		document.body.style.overflow = '';
	}

	// Initialize selectedFilters with an empty array
	let selectedFilters = [];
	let appliedFilters = [];

	/**
	 * @type {any[]}
	 */
	let products = [];

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
			// Check if product matches all selected labels or ingredients
			const labelMatch = selectedFilters.every((filter) => product.labels.includes(filter));
			const ingredientMatch = selectedFilters.every((filter) =>
				product.ingredients.includes(filter)
			);

			// Include the product if it matches all selected labels or ingredients
			return labelMatch || ingredientMatch;
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
	});

	function fetchLabelFilters(products) {
		let labels = [];
		products.forEach((product) => {
			labels = labels.concat(product.labels.filter((label) => !labels.includes(label)));
		});
		return labels;
	}

	function fetchIngredientFilters(products) {
		let ingredients = [];
		products.forEach((product) => {
			ingredients = ingredients.concat(
				product.ingredients.filter((ingredient) => !ingredients.includes(ingredient))
			);
		});
		return ingredients;
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
	function search(event) {
		let searchText = event.detail.searchText;
		let category = event.detail.category;
		console.log('Searching for:', searchText, 'in category:', category);
		// TODO: Add search call to backend here
		// products = ...
	}

	// Function to download CSV
	function downloadCSV() {
		let selectedProductsIds = [];
		document.querySelectorAll('input[type=checkbox].lineCheckBox').forEach((checkbox) => {
			if (checkbox.checked) {
				const id = checkbox.id.substring(checkbox.id.indexOf('-') + 1);
				selectedProductsIds.push(id);
			}
		});
		console.log('SelectedProducts: ', selectedProductsIds);
		// TODO: Add here call to backend to download CSV (dont forget to send the selected products)
		const fileUrl = '';
		const filename = 'output.csv';
		// Create a temporary anchor element
		const link = document.createElement('a');
		link.href = fileUrl;
		link.setAttribute('download', 'output.csv');
		// Programmatically click the anchor element to trigger the download
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Function to toggle all checkboxes
	let headerChecked = true;

	function toggleAll() {
		headerChecked = !headerChecked;
		document.querySelectorAll('.lineCheckBox').forEach((checkbox) => {
			checkbox.checked = headerChecked;
		});
	}

	// Function to toggle a single checkbox
	function toggleCheckbox(event) {
		if (!event.target.checked) {
			headerChecked = false;
		}
	}

	function editProduct(info) {
		console.log(info);
		//TODO: Add here call to backend to edit product - info is an object with the following fields: id, code, name, description, labels
	}

	// Default label and ingredient filters
	let labelFilters = [];
	let ingredientFilters = [];

	// Context API to share data between components
	setContext('selectedFilters', selectedFilters);
</script>

<div class="flex-column flex">
	<Nav page="records" />
	<main class="flex-1 overflow-x-hidden p-10">
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
		<Table hoverable={true} class="mt-10">
			<TableHead class="text-neutral-600">
				<TableHeadCell class="!p-3">
					<Checkbox
						on:click={toggleAll}
						class="text-primary  focus:outline-primary"
						bind:checked={headerChecked}
					/>
				</TableHeadCell>
				<TableHeadCell class="font-medium">Upload time</TableHeadCell>
				<TableHeadCell class="font-medium">Code</TableHeadCell>
				<TableHeadCell class="font-medium">Name</TableHeadCell>
				<TableHeadCell class="font-medium">Description</TableHeadCell>
				<TableHeadCell class="font-medium">Labels</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">
						<EditOutline class="h-6 w-6" />
					</span>
				</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each products as product, index}
					<TableBodyRow on:click={() => toggleModal(index, 'view')}>
						<TableBodyCell class="!p-3">
							<Checkbox
								checked={true}
								on:click={toggleCheckbox}
								id="checkbox-{product._id._id}"
								class="lineCheckBox  text-primary focus:outline-primary"
							/>
						</TableBodyCell>
						<TableBodyCell class="font-light">
							<div class="font-bold">...</div>
						</TableBodyCell>
						<TableBodyCell class="font-light">{product.code}</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">{product.name}</TableBodyCell>
						<TableBodyCell class="font-light">
							<div class="text-wrap">
								{product.description.substring(0, 100)}...
							</div>
						</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">{product.labels}</TableBodyCell>
						<TableBodyCell class="font-light">
							<button
								on:click={() => {
									toggleModal(index, 'edit');
								}}
								class="text-primary-600"
							>
								<EditOutline class="h-6 w-6" />
							</button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		{#if !products.length}
			<Heading tag="h5" class="w-100 mt-5 text-center"
				>No products found, try to upload a image...</Heading
			>
		{/if}
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
					{/each}
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

		<Modal size="lg" bind:open={showModal} autoclose outsideclose on:close={closeModal}>
			{#if modalMode === 'view'}
				<Heading tag="h5" class="flex justify-start">
					View Product #{modalIndex}

					<button
						class="text-primary-600 pl-3"
						on:click={() => {
							modalMode = 'edit';
						}}
					>
						<EditOutline class="h-6 w-6" />
					</button>
				</Heading>

				<hr />

				<div class="mb-6 grid gap-6 md:grid-cols-2">
					<div>
						<Label class="mb-2">Code</Label>
						<Input
							class="disabled:opacity-1 focus:border-gray-300"
							style="box-shadow:none"
							type="text"
							disabled
							value={products[modalIndex].code}
						/>
					</div>

					<div>
						<Label class="mb-2">Name</Label>
						<Input
							class="disabled:opacity-1 focus:border-gray-300"
							style="box-shadow:none"
							type="text"
							disabled
							value={products[modalIndex].name}
						/>
					</div>
				</div>

				<div>
					<Label class="mb-2">Description</Label>
					<Textarea
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						rows="10"
						disabled
						value={products[modalIndex].description}
					/>
				</div>

				<div>
					<Label class="mb-2">Labels</Label>
					<Input
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						disabled
						value={products[modalIndex].labels.join(', ')}
					/>
				</div>
			{:else}
				<Heading tag="h5" class="flex justify-start">
					Edit Product #{modalIndex}
				</Heading>

				<hr />
				<div class="mb-6 grid gap-6 md:grid-cols-2">
					<div>
						<Label class="mb-2">Code</Label>
						<Input
							id="editCode"
							class="disabled:opacity-1 focus:border-gray-300"
							style="box-shadow:none"
							type="text"
							value={products[modalIndex].code}
						/>
					</div>

					<div>
						<Label class="mb-2">Name</Label>
						<Input
							id="editName"
							class="disabled:opacity-1 focus:border-gray-300"
							style="box-shadow:none"
							type="text"
							value={products[modalIndex].name}
						/>
					</div>
				</div>

				<div>
					<Label class="mb-2">Description</Label>
					<Textarea
						id="editDescription"
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						rows="10"
						value={products[modalIndex].description}
					/>
				</div>

				<div>
					<Label class="mb-2">Labels</Label>
					<Input
						id="editLabels"
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						value={products[modalIndex].labels.join(', ')}
					/>
				</div>

				<div class="flex justify-center">
					<Button
						on:click={() => {
							editProduct({
								id: modalIndex,
								code: document.getElementById('editCode').value,
								name: document.getElementById('editName').value,
								description: document.getElementById('editDescription').value,
								labels: document.getElementById('editLabels').value.split(', ')
							});
						}}
						color="red"
						size="md"
						class="w-40"
					>
						Save
					</Button>
				</div>
			{/if}
		</Modal>
	</main>
</div>
