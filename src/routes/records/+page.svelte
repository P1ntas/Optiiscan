<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';

	function search(event) {
		let searchText = event.detail.searchText;
		let category = event.detail.category;

		console.log('Searching for:', searchText, 'in category:', category);

		//TODO: Add search call to backend here
	}
</script>

<div class="flex-column flex">
	<Nav page="records" />
	<main class="flex-1 p-10">
		<SearchBar on:search={search} />
		<hr class="my-7 h-px border-0 bg-black bg-opacity-10" />
	</main>
</div>

<style>
</style>
