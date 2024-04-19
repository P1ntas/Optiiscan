<script>
	import Dropzone from '../../components/Dropzone.svelte';
	import Nav from '../../components/Nav.svelte';

	import { Heading, P, Button } from 'flowbite-svelte';

	let files = [];

	function handleClick() {
		//Send files to server
		console.log('Sending files to server');

		//TODO: Add upload to backend here
		files = [];
	}

	$: {
		console.log(files);
	}
</script>

<div class="flex-column flex">
	<Nav page="upload" />

	<main class="flex-1 p-10">
		<Heading tag="h2" class="text-black">Upload Image(s)</Heading>
		<P>Add your products packaging images here</P>
		<hr class="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700" />
		<Dropzone bind:files />
		<div class="mt-6 flex justify-center">
			<Button on:click={handleClick} color="red">Upload</Button>
		</div>
	</main>
</div>

<style>
</style>
