<script>
	import '../app.css';
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width" />
</svelte:head>

<div>
	<slot />
</div>

<style>
	div {
		padding: 1rem;
		margin: auto;
		max-width: var(--containerWidth);
	}

	@media (max-width: 600px) {
		div {
			padding: 0 1rem;
		}
	}
</style>
