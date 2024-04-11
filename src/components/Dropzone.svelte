<script>
	import { Dropzone } from 'flowbite-svelte';
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let types = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/zip'];

	export let files = [];

	//uploading by drag
	const dropHandle = (event) => {
		event.preventDefault();
		if (event.dataTransfer.items) {
			[...event.dataTransfer.items].forEach((item, i) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					//Check file type
					if (types.includes(file.type)) {
						files.push(file);
					}
				}
			});
			files = files;
		} else {
			[...event.dataTransfer.files].forEach((file, i) => {
				if (types.includes(file.type)) files.push(file);
			});
			files = files;
		}
	};

	//Uploading by click
	const handleChange = (event) => {
		const new_files = event.target.files;

		if (new_files.length > 0) {
			for (let i = 0; i < new_files.length; i++) {
				if (types.includes(new_files[i].type)) {
					files.push(new_files[i]);
				}
			}
			files = files;
		}
	};
</script>

<Dropzone
	id="dropzone"
	on:drop={dropHandle}
	on:dragover={(event) => {
		event.preventDefault();
	}}
	on:change={handleChange}
	multiple
	accept={types.join(', ')}
>
	<svg
		aria-hidden="true"
		class="mb-3 h-10 w-10 text-gray-400"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
		/></svg
	>

	<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
		<span class="font-semibold">Click to upload</span> or drag and drop
	</p>
	<p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF or ZIP (Max 10MB)</p>
</Dropzone>

{#if files.length > 0}
	<Listgroup class="mt-3">
		{#each files as file, i}
			<ListgroupItem key={i} class="border-1 flex">
				{#if file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'}
					<img alt="upload preview" class="h-11 w-11" src={URL.createObjectURL(file)} />
				{:else if file.type === 'application/pdf'}
					<img alt="upload preview" class="h-11 w-11" src="/pdfIcon.png" />
				{:else if file.type === 'application/zip'}
					<img alt="upload preview" class="h-11 w-11" src="/zipIcon.png" />
				{/if}
				<div class="ml-2">
					<p class="text-black">{file.name}</p>
					<p class="text-gray-500">{Math.floor(file.size / 1000)} kB</p>
				</div>
			</ListgroupItem>
		{/each}
	</Listgroup>
{/if}
