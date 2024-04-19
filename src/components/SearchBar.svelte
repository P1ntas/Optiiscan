<script>
	import { Search, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { SearchOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	//Categories
	const items = [
		{
			label: 'All categories'
		},
		{
			label: 'Frozen food'
		},
		{
			label: 'Fruits'
		},
		{
			label: 'Meat'
		},
		{
			label: 'Hygiene'
		}
	];
	let selectCategory = 'All categories';
	let searchText = '';

	function handleClick() {
		//console.log('Searching for:', searchText, 'in category:', selectCategory);
		const searchObject = {
			searchText: searchText,
			category: selectCategory
		};

		dispatch('search', searchObject);
	}
</script>

<form class="flex justify-start">
	<div class="relative">
		<Button
			class="h-15 border-primary-700 w-48 justify-between  whitespace-nowrap rounded-e-none border border-e-0 text-neutral-600"
			outline={false}
			style="box-shadow:none"
		>
			{selectCategory}
			<ChevronDownOutline class="ms-3 h-5 w-5" />
		</Button>
		<Dropdown classContainer="w-48">
			{#each items as { label }}
				<DropdownItem
					on:click={() => {
						selectCategory = label;
					}}
					class={selectCategory === label ? 'underline' : ''}
				>
					{label}
				</DropdownItem>
			{/each}
		</Dropdown>
	</div>
	<div class="mr-2 w-96">
		<Search
			size="md"
			bind:value={searchText}
			class="h-15 w-96 max-w-96 rounded-l-none focus:border-gray-300"
			placeholder="Search"
			style="box-shadow:none"
		/>
	</div>

	<Button on:click={handleClick} color="light" style="box-shadow:none">Search</Button>
</form>

<style>
</style>
