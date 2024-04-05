<script>
	import '../app.css';
</script>

<slot />

<style lang="postcss">
	:root {
		background-color: '#ffffff';
	}

	:global(html) {
		min-height: 100vh;
	}

	:global(body) {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
