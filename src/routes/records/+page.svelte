<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, P, Button } from 'flowbite-svelte';
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

	//Filled just for test purposes
	let products = [
		{
			id: 0,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 1,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 2,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 3,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 4,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 5,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 6,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 7,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		},
		{
			id: 8,
			uploadTime: '2021-09-01 12:00',
			code: '22455532456',
			name: 'Sea Salt Almonds',
			description:
				'Sea salt almonds offer a tantalizing fusion of natural goodness and savory satisfaction. Each almond is delicately roasted to perfection, enhancing its rich nutty flavor while ensuring a satisfying crunch in every bite. The addition of sea salt adds a delightful contrast, elevating the taste profile with a subtle yet distinct saline essence that perfectly complements the almonds inherent sweetness.',
			labels: 'Vegan, Gluten-Free, Non-GMO'
		}
	];

	$: numProducts = products.length;

	let headerChecked = true;

	function search(event) {
		let searchText = event.detail.searchText;
		let category = event.detail.category;

		console.log('Searching for:', searchText, 'in category:', category);

		//TODO: Add search call to backend here
		//products = ...
	}

	function downloadCSV() {
		let selectedProductsIds = [];
		document.querySelectorAll('input[type=checkbox].lineCheckBox').forEach((checkbox) => {
			if (checkbox.checked) {
				const id = checkbox.id.substring(checkbox.id.indexOf('-') + 1);
				selectedProductsIds.push(id);
			}
		});

		console.log('SelectedProducts: ', selectedProductsIds);

		//TODO: Add here call to backend to download CSV (dont forget to send the selected products)

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

	function toggleAll() {
		console.log('toggleAll!!');

		headerChecked = !headerChecked;

		document.querySelectorAll('.lineCheckBox').forEach((checkbox) => {
			checkbox.checked = headerChecked;
		});
	}

	function toggleCheckbox(event) {
		if (!event.target.checked) {
			headerChecked = false;
		}
	}
</script>

<div class="flex-column flex">
	<Nav page="records" />
	<main class="flex-1 overflow-x-hidden p-10">
		<SearchBar on:search={search} />
		<hr class="my-7 h-px border-0 bg-black bg-opacity-10" />

		<div class="flex">
			<Heading tag="h3" class="text-black">Products</Heading>
			<Button on:click={downloadCSV} color="red" size="md" class="w-40">
				<DownloadSolid class="me-2 h-4 w-4" />
				Export CSV
			</Button>
		</div>

		<p>Showing <span class="font-bold">{numProducts} products</span></p>

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
				{#each products as product (product.id)}
					<TableBodyRow>
						<TableBodyCell class="!p-3">
							<Checkbox
								checked={true}
								on:click={toggleCheckbox}
								id="checkbox-{product.id}"
								class="lineCheckBox  text-primary focus:outline-primary"
							/>
						</TableBodyCell>
						<TableBodyCell class="font-light">
							<div class="font-bold">{product.uploadTime.split(' ')[0]}</div>
							{product.uploadTime.split(' ')[1]}
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
									console.log('Edit product:', product.id);
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
	</main>
</div>
