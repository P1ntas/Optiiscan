<script>
	import Nav from '../../components/Nav.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
	import { Heading, Badge, Button, P, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { BadgeCheckSolid, CloseCircleSolid, SortOutline } from 'flowbite-svelte-icons';
	import { Modal } from 'flowbite-svelte';

	import { Input, Label } from 'flowbite-svelte';

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

	function toggleModal(index) {
		modalIndex = index;
		showModal = true;
		document.body.style.overflow = 'hidden';
	}

	function closeModal() {
		showModal = false;
		document.body.style.overflow = '';
	}

	let logsOrder = 0;
	function sortLogs() {
		console.log('Sorting logs');
		if (logsOrder === 0) {
			logsOrder = 1;
			logs = logs.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
		} else {
			logsOrder = 0;
			logs = logs.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
		}
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
				<TableHeadCell class="font-medium">
					<div class="flex gap-2 align-middle">
						Upload time
						<button type="button" on:click={sortLogs}>
							<SortOutline class="h-5 w-5" />
						</button>
					</div>
				</TableHeadCell>
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
								<div>{log.elapsedTime}</div>
							{:else}
								<div>-</div>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="font-light">
							<div>
								{log.numImages}
							</div>
						</TableBodyCell>
						<TableBodyCell class="text-wrap font-light">
							<Button
								class="text-black"
								style="display: block;"
								on:click={() => {
									toggleModal(index);
								}}
							>
								<div style="display: flex;">
									{#if log.infoCorrect}
										<BadgeCheckSolid class="text-green-700"></BadgeCheckSolid>
										<span class="mr-2 font-light">{log.infoCorrect}</span>
									{/if}
									{#if log.infoError}
										<CloseCircleSolid class="text-red-700"></CloseCircleSolid>
										<span class="font-light">{log.infoError}</span>
									{/if}
								</div>
								<div class="font-light" style="display: flex;">
									Click to see details
								</div>
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
			<Heading tag="h6" class="w-100 mt-5 text-center"
				>No logs found, try to upload a image...</Heading
			>
		{/if}

		<Modal
			size="lg"
			title="Log #{modalIndex}"
			bind:open={showModal}
			autoclose
			outsideclose
			on:close={closeModal}
		>
			<div class="mb-6 grid gap-6 md:grid-cols-3">
				<div>
					<Label class="mb-2">Upload Time</Label>
					<Input
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						disabled
						value="{logs[modalIndex].uploadDate
							? logs[modalIndex]['uploadDate'].substring(0, 10)
							: '-'}  {logs[modalIndex].uploadDate
							? logs[modalIndex]['uploadDate'].substring(11, 16)
							: ''}"
					/>
				</div>

				<div>
					<Label class="mb-2">Finish Time</Label>
					<Input
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						disabled
						value="{logs[modalIndex].finishDate
							? logs[modalIndex].finishDate.substring(0, 10)
							: '-'}  {logs[modalIndex].finishDate
							? logs[modalIndex].finishDate.substring(11, 16)
							: ''}"
					/>
				</div>

				<div>
					<Label class="mb-2">Elapsed Time</Label>
					<Input
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						disabled
						value={logs[modalIndex].elapsedTime ? logs[modalIndex].elapsedTime : '-'}
					/>
				</div>
			</div>

			<div>
				<Label class="mb-2">Info</Label>
				<Textarea
					class="disabled:opacity-1 focus:border-gray-300"
					style="box-shadow:none"
					type="text"
					rows="10"
					disabled
					value={logs[modalIndex].info.join('\n')}
				/>
			</div>

			<div class="mb-6 grid gap-6 md:grid-cols-2">
				<div>
					<Label class="mb-2">Number images</Label>
					<Input
						class="disabled:opacity-1 focus:border-gray-300"
						style="box-shadow:none"
						type="text"
						disabled
						value={logs[modalIndex].numImages}
					/>
				</div>

				<div>
					<Label class="mb-2">Status</Label>
					<Badge
						rounded
						class="h-10 w-28 px-2 py-1 text-center uppercase text-white {logs[
							modalIndex
						].status === 'running'
							? 'bg-inprogress'
							: ''} {logs[modalIndex].status === 'aborted' ? 'bg-error' : ''} {logs[
							modalIndex
						].status === 'completed'
							? 'bg-finish'
							: ''}"
					>
						{logs[modalIndex].status}
					</Badge>
				</div>
			</div>
		</Modal>
	</main>
</div>
