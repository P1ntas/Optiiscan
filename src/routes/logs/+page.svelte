<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, P } from 'flowbite-svelte';
	import { Badge } from 'flowbite-svelte';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	//Filled just for test purposes
	let products = [
		{
			id: 0,
			uploadTime: '2021-09-01 12:00',
			finishTime: '2021-09-01 12:20',
			elapsedTime: '20 min',
			numberImages: '10',
			info: '2024-03-08 14:00:00 - INFO - Starting image processing task. 2024-03-08 14:00:05 - INFO - Loading image files for processing ...',
			status: 'Finish'
		},
		{
			id: 1,
			uploadTime: '2021-09-01 12:00',
			finishTime: '2021-09-01 12:20',
			elapsedTime: '20 min',
			numberImages: '10',
			info: '2024-03-08 14:00:00 - INFO - Starting image processing task. 2024-03-08 14:00:05 - INFO - Loading image files for processing ...',
			status: 'In Progress'
		},
		{
			id: 2,
			uploadTime: '2021-09-01 12:00',
			finishTime: '2021-09-01 12:20',
			elapsedTime: '20 min',
			numberImages: '10',
			info: '2024-03-08 14:00:00 - INFO - Starting image processing task. 2024-03-08 14:00:05 - INFO - Loading image files for processing ...',
			status: 'Error'
		},
		{
			id: 3,
			uploadTime: '2021-09-01 12:00',
			finishTime: '2021-09-01 12:20',
			elapsedTime: '20 min',
			numberImages: '10',
			info: '2024-03-08 14:00:00 - INFO - Starting image processing task. 2024-03-08 14:00:05 - INFO - Loading image files for processing ...',
			status: 'Finish'
		}
	];

	$: numProducts = products.length;

	function search(event) {
		let searchText = event.detail.searchText;
		let category = event.detail.category;

		console.log('Searching for:', searchText, 'in category:', category);

		//TODO: Add search call to backend here
		//products = ...
	}
</script>

<div class="flex-column flex">
	<Nav page="logs" />
	<main class="flex-1 overflow-x-hidden p-10">
		<SearchBar on:search={search} />
		<hr class="my-7 h-px border-0 bg-black bg-opacity-10" />

		<div class="flex">
			<Heading tag="h3" class="text-black">Logs</Heading>
		</div>

		<p>Showing <span class="font-bold">{numProducts} logs</span></p>

		<Table hoverable={true} class="mt-10">
			<TableHead class="text-neutral-600">
				<TableHeadCell class="font-medium">Upload time</TableHeadCell>
				<TableHeadCell class="font-medium">Finish time</TableHeadCell>
				<TableHeadCell class="font-medium">Elapsed time</TableHeadCell>
				<TableHeadCell class="font-medium">Number images</TableHeadCell>
				<TableHeadCell class="font-medium">Info</TableHeadCell>
				<TableHeadCell class="font-medium">Status</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each products as product (product.id)}
					<TableBodyRow>
						<TableBodyCell class="font-light">
							<div class="font-bold">{product.uploadTime.split(' ')[0]}</div>
							{product.uploadTime.split(' ')[1]}
						</TableBodyCell>
						<TableBodyCell class="font-light">
							<div class="font-bold">{product.finishTime.split(' ')[0]}</div>
							{product.finishTime.split(' ')[1]}</TableBodyCell
						>
						<TableBodyCell class="text-wrap font-light"
							>{product.elapsedTime}</TableBodyCell
						>
						<TableBodyCell class="font-light">
							<div class="text-wrap">
								{product.numberImages.substring(0, 200)}
							</div>
						</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">{product.info}</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">
							<Badge
								rounded
								class="h-10 w-28 px-2 py-1 text-center uppercase text-white {product.status ===
								'In Progress'
									? 'bg-inprogress'
									: ''} {product.status === 'Error'
									? 'bg-error'
									: ''} {product.status === 'Finish' ? 'bg-finish' : ''}"
							>
								{product.status}
							</Badge>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</main>
</div>
