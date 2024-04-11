<script>
	import { Button } from 'flowbite-svelte';
</script>

<div class="mycontainer">
	<img class="logo" src="/logoBig.png" alt="Logo" />
	<Button href="/upload" color="red" style="box-shadow:none">Enter</Button>
</div>

<style>
	.mycontainer {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #222451;
	}

	.logo {
		width: 40%;
		height: auto;
	}
</style>
