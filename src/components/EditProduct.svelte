<script>
	import { Modal, Textarea, Input, Label, Button } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { success, error } from '../toasts';

	const dispatch = createEventDispatcher();

	export let show = false;
	export let product = '';
	export let data = {};

	async function onSave() {
		let fields = {};
		Object.keys(data).forEach((k) => {
			const input = document.getElementById(k);
			if (input) fields[k] = document.getElementById(k).value;
		});

		const options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fields)
		};
		try {
			const response = await fetch('/api/products', options);
			await response.json();
			success('Record changed succesfully.');
			dispatch('refreshProducts');
		} catch {
			error('Something went wrong!');
		}
	}
</script>

<Modal
	size="lg"
	title={'Edit Product - ' + product}
	bind:open={show}
	autoclose
	outsideclose
	on:close={() => {
		show = false;
	}}
>
	{#each Object.keys(data) as key}
		<div class={key == '_id' || key == 'uploadTime' ? 'hidden' : ''}>
			<Label class="mb-2">{key.toUpperCase()}</Label>
			{#if typeof data[key] === 'object'}
				<Textarea
					id={key}
					class="opacity-1 focus:border-gray-300"
					style="box-shadow:none"
					type="text"
					rows="10"
					value={JSON.stringify(data[key])}
				/>
			{:else}
				<Input
					id={key}
					class="opacity-1 focus:border-gray-300"
					style="box-shadow:none"
					type="text"
					value={data[key]}
				/>
			{/if}
		</div>
	{/each}

	<div class="flex justify-center">
		<Button on:click={onSave} color="red" size="md" class="w-40">Save</Button>
	</div>
</Modal>
