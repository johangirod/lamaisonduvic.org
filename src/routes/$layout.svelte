<script>
	import '../app.css';
</script>

<div>
	<slot />
	<nav>
		<a href="/#projet">Le projet</a> ·
		<a href="/#tarifs">Tarifs</a> ·
		<a href="/#lieu">Nous trouver</a> ·
		<a href="mailto:lamaisonduvic@lilo.org">Nous écrire</a>
	</nav>
</div>

<style>
	nav {
		text-align: center;
		position: sticky;
		bottom: 0.26rem;
		padding: 0.6rem;
		margin: 0 -1rem;
		z-index: 1;
		background-color: var(--color);

		/* border: 1px solid var(--color); */
		border-radius: 0.3rem;
		border-top-right-radius: 0;
		border-top-left-radius: 0;
		color: #ffffffee;
	}
	nav a {
		color: #ffffffee;
	}
	div {
		padding: 1rem;
		margin: auto;
		max-width: var(--containerWidth);
	}
</style>
