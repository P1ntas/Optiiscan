<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, Badge, Button, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { BadgeCheckSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { Modal } from 'flowbite-svelte';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let logs = [];

	let modalIndex;
	let showModal = null;

	onMount(async () => {
		logs = await fetch('/api/logs').then((res) => res.json());
	});

	$: numLogs = logs.length;

	function search(event) {
		let searchText = event.detail.searchText;
		let category = event.detail.category;

		console.log('Searching for:', searchText, 'in category:', category);

		//TODO: Add search call to backend here
		//logs = ...
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

		<p>Showing <span class="font-bold">{numLogs} logs</span></p>

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
				{#each logs as log, index}
					<TableBodyRow>
						<TableBodyCell class="font-light">
							<div class="font-bold">{log.uploadDate.substring(0, 10)}</div>
							{log.uploadDate.substring(11, 16)}
						</TableBodyCell>
						<TableBodyCell class="font-light">
							{#if log.finishDate}
								<div class="font-bold">{log.finishDate.substring(0, 10)}</div>
								{log.finishDate.substring(11, 16)}
							{:else}
								<div class="font-bold">-</div>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">
							{#if log.elapsedTime}
								<div class="font-bold">{log.elapsedTime}</div>
							{:else}
								<div class="font-bold">-</div>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="font-light">
							<div class="font-bold">
								{log.numImages}
							</div>
						</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">
							<Button
								class="text-black"
								style="display: block;"
								on:click={() => {
									modalIndex = index;
									showModal = true;
								}}
							>
								<div style="display: flex;">
									{#if log.infoCorrect}
										<BadgeCheckSolid class="text-green-700"></BadgeCheckSolid>
										<span class="mr-2 font-bold">{log.infoCorrect}</span>
									{/if}
									{#if log.infoError}
										<CloseCircleSolid class="text-red-700"></CloseCircleSolid>
										<span class="font-bold">{log.infoError}</span>
									{/if}
								</div>
								<div style="display: flex;">Click to see details</div>
							</Button>
						</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">
							<Badge
								rounded
								class="h-10 w-28 px-2 py-1 text-center uppercase text-white {log.status ===
								'running'
									? 'bg-inprogress'
									: ''} {log.status === 'aborted'
									? 'bg-error'
									: ''} {log.status === 'completed' ? 'bg-finish' : ''}"
							>
								{log.status}
							</Badge>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		{#if !logs.length}
			<Heading tag="h5" class="w-100 mt-5 text-center"
				>No logs found, try to upload a image...</Heading
			>
		{/if}

		<Modal title="Info" bind:open={showModal} autoclose outsideclose>
			{#each logs[modalIndex]['info'] as info}
				<P>{info}</P>
			{/each}
		</Modal>
	</main>
</div>
