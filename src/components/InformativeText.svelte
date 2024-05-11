<script>
	import { Modal, P } from 'flowbite-svelte';

	export let show = false;
	export let product = '';
	export let data = {};
</script>

<Modal
	size="xl"
	title={'Informative Text - ' + product}
	bind:open={show}
	autoclose
	outsideclose
	on:close={() => {
		show = false;
	}}
>
	{#each Object.keys(data) as key}
		<P>{key.toUpperCase()}</P>{data[key]}
		<br />
	{/each}
</Modal>
