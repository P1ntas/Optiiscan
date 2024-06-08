<script>
	import Dropzone from '../../components/Dropzone.svelte';
	import Nav from '../../components/Nav.svelte';
	import { Heading, P, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	const models = [
		{
			model: 'Gemini'
		},
		{
			model: 'GPT-4V'
		}
	];
	$: activeModel = models[0].model;
	import { success } from '../../toasts';

	let files = [];

	async function handleClick() {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('files', file);
		});

		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1]);
		}

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			if (response.status === 200) {
				const responseData = await response.json();
				files = [];
				console.log(responseData.message);
				const filePaths = responseData.files.map((file) => {
					return file.filePath;
				});
				console.log(filePaths);
				const scanUrl = '/api/scan';
				const scanOptions = {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ filePaths, activeModel })
				};
				fetch(scanUrl, scanOptions);
				success('Scanning started with success...');
			} else {
				console.error('Failed to upload files');
			}
		} catch (error) {
			console.error('Error uploading files:', error);
		}
	}
</script>

<div class="flex-column flex">
	<Nav page="upload" />

	<main class="flex-1 p-10">
		<Heading tag="h2" class="text-black">Upload Image(s)</Heading>
		<P>Add your products packaging images here</P>
		<hr class="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700" />
		<Dropzone bind:files />
		<div class="mt-6 flex justify-center gap-5">
			<Button
				class="h-15 border-primary-700 w-48 justify-between  whitespace-nowrap border text-neutral-600"
				outline={false}
				style="box-shadow:none"
			>
				{activeModel}
				<ChevronDownOutline class="ms-3 h-5 w-5" />
			</Button>
			<Dropdown classContainer="w-48">
				{#each models as { model }}
					<DropdownItem
						on:click={() => {
							activeModel = model;
						}}
						class={activeModel === model ? 'underline' : ''}
					>
						{model}
					</DropdownItem>
				{/each}
			</Dropdown>
			<Button on:click={handleClick} color="red">Upload</Button>
		</div>
	</main>
</div>

<style>
</style>
