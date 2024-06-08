<script>
	import { Modal, Textarea, Input, Label, Button } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { success, error } from '../toasts';
	import { stringify } from 'postcss';

	const dispatch = createEventDispatcher();

	export let show = false;
	export let product = '';
	export let data = {};

	function parseObject(obj, prefix) {
		let fields = {};
		Object.keys(obj).forEach((k) => {
			if (k === 'labels') {
				const input = document.getElementById(prefix + k);
				if (input) fields[k] = input.value.split(',').map((x) => x.trim());
			} else if (typeof obj[k] === 'object') {
				fields[k] = JSON.stringify(parseObject(obj[k], prefix + k));
			} else {
				const input = document.getElementById(prefix + k);
				if (input) fields[k] = input.value;
			}
		});
		return fields;
	}

	async function onSave() {
		let fields = parseObject(data, '');

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
			{#if typeof data[key] === 'object' && key !== 'labels'}
				{#each Object.keys(data[key]) as _key}
					<Label class="mb-2">{_key.toUpperCase()}</Label>
					{#if typeof data[key][_key] === 'object'}
						<div class="mb-6 grid gap-6 md:grid-cols-3">
							{#each Object.keys(data[key][_key]) as __key}
								<Label class="mb-2">{__key}</Label>
							{/each}
							{#each Object.keys(data[key][_key]) as __key}
								<Input
									id={key + _key + __key}
									class="opacity-1 focus:border-gray-300"
									style="box-shadow:none"
									type="text"
									value={data[key][_key][__key]}
								/>
							{/each}
						</div>
					{:else if data[key][_key].length > 20}
						<Textarea
							id={key + _key}
							class="opacity-1 focus:border-gray-300"
							style="box-shadow:none"
							type="text"
							rows="10"
							value={typeof data[key][_key] === 'object'
								? JSON.stringify(data[key][_key])
								: data[key][_key]}
						/>
					{:else}
						<Input
							id={key + _key}
							class="opacity-1 focus:border-gray-300"
							style="box-shadow:none"
							type="text"
							value={typeof data[key][_key] === 'object'
								? JSON.stringify(data[key][_key])
								: data[key][_key]}
						/>
					{/if}
				{/each}
			{:else}
				<Label class="mb-2">{key.toUpperCase()}</Label>
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
