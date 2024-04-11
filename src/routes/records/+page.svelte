<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, P, Button } from 'flowbite-svelte';
	import { DownloadSolid } from 'flowbite-svelte-icons';

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
	</main>
</div>

<style>
</style>
