<script>
	import Dropzone from '../../components/Dropzone.svelte';
	import Nav from '../../components/Nav.svelte';

	import { Heading, P, Button } from 'flowbite-svelte';
</script>

<div class="flex-column flex">
	<Nav page="upload" />

	<main class="flex-1 p-10">
		<Heading tag="h2">Upload Image(s)</Heading>
		<P>Add your products packaging images here</P>
		<hr class="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700" />
		<Dropzone />
		<div class="mt-6 flex justify-center">
			<Button color="red">Upload</Button>
		</div>
	</main>
</div>

<style>
</style>
