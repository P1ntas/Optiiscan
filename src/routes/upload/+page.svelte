<script>
	import Dropzone from '../../components/Dropzone.svelte';
	import Nav from '../../components/Nav.svelte';
	import { Heading, P, Button } from 'flowbite-svelte';
  
	let files = [];
  
	async function handleClick() {
	  const formData = new FormData();
	  files.forEach(file => {
		formData.append('files', file);
	  });

	  for (var pair of formData.entries()) {
		console.log(pair[0]+ ', ' + pair[1]);
	  }
  
	  try {
		const response = await fetch('/api/upload', {
		  method: 'POST',
		  body: formData
		});
		if (response.status === 200) {
		  const responseData = await response.json();
		  console.log(responseData.message);
		  files = [];
		} else {
		  console.error('Failed to upload files');
		}
	  } catch (error) {
		console.error('Error uploading files:', error);
	  }
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
  