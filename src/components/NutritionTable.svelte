<script>
	import { Modal } from 'flowbite-svelte';

	import { TableBody, TableBodyCell, TableHead, TableHeadCell, P } from 'flowbite-svelte';

	export let show = false;
	export let product = '';
	export let data = {};
</script>

<Modal
	size="xl"
	title={'Nutrition Table - ' + product}
	bind:open={show}
	autoclose
	outsideclose
	on:close={() => {
		show = false;
	}}
>
	<TableHead class="text-neutral-600">
		{#each Object.keys(data) as key}
			<TableHeadCell class="font-medium">{key}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each Object.values(data) as col}
			<TableBodyCell>
				{#each Object.keys(col) as key}
					<P>{key}</P> {col[key]}
				{/each}
			</TableBodyCell>
		{/each}
	</TableBody>
</Modal>
