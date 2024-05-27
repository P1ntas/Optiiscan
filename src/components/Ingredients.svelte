<script>
	import { Modal } from 'flowbite-svelte';

	export let show = false;
	export let product = '';
	export let data = '';
</script>

<Modal
	size="xl"
	title={'Ingredients - ' + product}
	bind:open={show}
	autoclose
	outsideclose
	on:close={() => {
		show = false;
	}}
>
	{data}
</Modal>
