<script>
	import { Spinner } from 'flowbite-svelte';
	/**
	 * @type ScanObject[]
	 */
	let data;
	const Status = {
		idle: 0,
		loading: 1
	};
	let status = Status.idle;
	const dir = 'static/test/products';
	const filePaths = [`${dir}/file_3.pdf`];
	async function generate() {
		if (status === Status.loading) return console.log('Loading, please wait.');
		status = Status.loading;
		const response = await fetch('/api/scan', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ filePaths })
		});
		data = JSON.parse(
			await response.text().then((text) => {
				status = Status.idle;
				return text;
			})
		);
		return data;
	}
</script>

<section
	class="m-auto flex h-fit w-fit flex-col justify-center gap-5 rounded-xl border border-2 p-10 text-center text-primary"
>
	<h1 class="mx-auto flex w-fit text-secondary">Here's the response:</h1>
	{#if status === Status.loading}
		<div class="m-auto">
			<Spinner class="fill-accent" />
		</div>
	{:else if data}
		{#each data as scan}
			<div class="m-auto flex w-fit flex-col gap-5 overflow-y-scroll py-5 text-center">
				<p>Title: {scan.name}</p>

				<p class="break-words text-center">Raw data: {JSON.stringify(scan)}</p>
			</div>
		{/each}
	{:else}
		<p class="text-center">Click the button</p>
	{/if}
	<button on:click={generate} class="m-auto flex h-auto w-36 border p-5">Generate response</button
	>
</section>
