<script>
	import { page } from '$app/stores';
	import PageTransitions from '$lib/PageTransitions.svelte';
	import '../app.css';



</script>
<div>
	<PageTransitions refresh={$page.path}>
		<slot />
	</PageTransitions>
</div>

<style>
	div {
		padding: 1rem;
		overflow-y: hidden;
		margin: auto;
		max-width: var(--containerWidth);
	}
</style>
