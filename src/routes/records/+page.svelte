<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, P, Button } from 'flowbite-svelte';
	import { DownloadSolid } from 'flowbite-svelte-icons';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';

	let products = [];
	$: numProducts = products.length;

	function search(event) {
		let searchText = event.detail.searchText;
		let category = event.detail.category;

		console.log('Searching for:', searchText, 'in category:', category);

		//TODO: Add search call to backend here
		//products = ...
	}

	function downloadCSV() {
		//TODO: Add here call to backend to download CSV

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
</script>

<div class="flex-column flex">
	<Nav page="records" />
	<main class="flex-1 p-10">
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
				<TableHeadCell class="!p-4">
					<Checkbox color="red" />
				</TableHeadCell>
				<TableHeadCell class="font-medium">Upload time</TableHeadCell>
				<TableHeadCell class="font-medium">Code</TableHeadCell>
				<TableHeadCell class="font-medium">Name</TableHeadCell>
				<TableHeadCell class="font-medium">Description</TableHeadCell>
				<TableHeadCell class="font-medium">Labels</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Edit</span>
				</TableHeadCell>
			</TableHead>
			<TableBody>
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox />
					</TableBodyCell>
					<TableBodyCell>Apple MacBook Pro 17"</TableBodyCell>
					<TableBodyCell>Sliver</TableBodyCell>
					<TableBodyCell>Laptop</TableBodyCell>
					<TableBodyCell>$2999</TableBodyCell>
					<TableBodyCell>
						<a
							href="/tables"
							class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							>Edit</a
						>
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox />
					</TableBodyCell>
					<TableBodyCell>Microsoft Surface Pro</TableBodyCell>
					<TableBodyCell>White</TableBodyCell>
					<TableBodyCell>Laptop PC</TableBodyCell>
					<TableBodyCell>$1999</TableBodyCell>
					<TableBodyCell>
						<a
							href="/tables"
							class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							>Edit</a
						>
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell class="!p-4">
						<Checkbox />
					</TableBodyCell>
					<TableBodyCell>Magic Mouse 2</TableBodyCell>
					<TableBodyCell>Black</TableBodyCell>
					<TableBodyCell>Accessories</TableBodyCell>
					<TableBodyCell>$99</TableBodyCell>
					<TableBodyCell>
						<a
							href="/tables"
							class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
							>Edit</a
						>
					</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	</main>
</div>

<style>
</style>
