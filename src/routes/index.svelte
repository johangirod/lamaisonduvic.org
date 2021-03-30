<script lang="ts" context="module">
 import Main from './_accueil.md';
</script>

<svelte:head>
	<title>La maison du vic</title>
	<meta name="description" content="Gîte associatif pour l'accueil des activités et des projets collectifs"/>
</svelte:head>
<main>
	<Main/>
</main>

<style>
	main {
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
