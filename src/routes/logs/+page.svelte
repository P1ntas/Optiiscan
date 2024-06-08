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

	const sortFunctions = {
		uploadTime: (a, b) => new Date(a.uploadDate) - new Date(b.uploadDate),
		finishTime: (a, b) => new Date(a.finishDate) - new Date(b.finishDate),
		elapsedTime: (a, b) =>
			parseFloat(a.elapsedTime?.split(' ')[0] ?? 0) -
			parseFloat(b.elapsedTime?.split(' ')[0] ?? 0),
		numberImages: (a, b) => a.numImages - b.numImages
	};

	let logsOrder = 0;
	function sortLogs(func) {
		console.log('Sorting logs');
		if (logsOrder === 0) {
			logsOrder = 1;
			logs = logs.sort(func);
		} else {
			logsOrder = 0;
			logs = logs.sort(func).reverse();
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

		<div class="table-container" style="overflow-y: auto; max-height: 600px;">
			<table class="mt-10 w-full text-left text-sm text-gray-500 dark:text-gray-400">
				<thead
					class="styled-thead"
					style="background-color: #f8fafc; position: sticky; top: 0; z-index: 10;"
				>
					<tr>
						<th class="px-6 py-3 font-medium">
							<div class="flex gap-2 align-middle">
								Upload time
								<button
									type="button"
									on:click={() => sortLogs(sortFunctions['uploadTime'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div>
						</th>
						<th class="px-6 py-3 font-medium">
							<div class="flex gap-2 align-middle">
								Finish time
								<button
									type="button"
									on:click={() => sortLogs(sortFunctions['finishTime'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div>
						</th>
						<th class="px-6 py-3 font-medium">
							<div class="flex gap-2 align-middle">
								Elapsed time
								<button
									type="button"
									on:click={() => sortLogs(sortFunctions['elapsedTime'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div></th
						>
						<th class="px-6 py-3 font-medium">
							<div class="flex gap-2 align-middle">
								Number images
								<button
									type="button"
									on:click={() => sortLogs(sortFunctions['numberImages'])}
								>
									<SortOutline class="h-5 w-5" />
								</button>
							</div></th
						>
						<th class="px-6 py-3 font-medium">Info</th>
						<th class="px-6 py-3 font-medium">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each logs as log, index}
						<tr
							class="border-b bg-white last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
						>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<div class="font-bold">{log.uploadDate.substring(0, 10)}</div>
								{log.uploadDate.substring(11, 16)}
							</td>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								{#if log.finishDate}
									<div class="font-bold">{log.finishDate.substring(0, 10)}</div>
									{log.finishDate.substring(11, 16)}
								{:else}
									<div class="font-bold">-</div>
								{/if}
							</td>
							<td
								class="whitespace-nowrap text-wrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								{#if log.elapsedTime}
									<div>{log.elapsedTime}</div>
								{:else}
									<div>-</div>
								{/if}
							</td>
							<td
								class="whitespace-nowrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<div>
									{log.numImages}
								</div>
							</td>
							<td
								class="whitespace-nowrap text-wrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
								<Button
									class="text-black"
									style="display: block;"
									on:click={() => {
										toggleModal(index);
									}}
								>
									<div style="display: flex;">
										{#if log.infoCorrect}
											<BadgeCheckSolid class="text-green-700"
											></BadgeCheckSolid>
											<span class="mr-2 font-light">{log.infoCorrect}</span>
										{/if}
										{#if log.infoError}
											<CloseCircleSolid class="text-red-700"
											></CloseCircleSolid>
											<span class="font-light">{log.infoError}</span>
										{/if}
									</div>
									<div class="font-light" style="display: flex;">
										Click to see details
									</div>
								</Button>
							</td>
							<td
								class="whitespace-nowrap text-wrap px-6 py-4 font-light text-gray-900 dark:text-white"
							>
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
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if !logs.length}
			<Heading tag="h6" class="w-100 mt-5 text-center">
				No logs found, try to upload an image...
			</Heading>
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
