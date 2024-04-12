<script>
	import { onMount } from 'svelte';
	import Nav from '../../components/Nav.svelte';

	let products = [];
	async function fetchProducts() {
		return await fetch('/api/products').then((res) => res.json());
	}
	onMount(async () => {
		products = await fetchProducts();
	});
</script>

<div class="flex-column flex">
	<Nav page="records" />

	<main class="flex-1 p-10">
		{#await products}
			<p>awaiting...</p>
		{:then navigation}
			<p>
				{#each Object.entries(products) as [key, product]}
					<p>ID: {product.id}</p>
					<p>BARCODE: {product.barcode}</p>
					<p>VEGAN: {product.vegan}</p>
					<p>WEIGHT: {product.weight}</p>
					<br />
				{/each}
			</p>
		{:catch error}
			<p>oh noes.</p>
		{/await}

		<br /><br /><br />

		<a id="add" href="/api/products/add" target="_blank">Add Random Product</a>
	</main>
</div>

<style>
</style>
