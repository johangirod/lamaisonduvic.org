<script>
	import Actualités from '$lib/Actualités.svelte';
	import Carrousel from '$lib/Carrousel.svelte';
	import logo from '../../static/images/logo.jpg?w=400&format=webp';
	import Content from './_accueil.md';
	import { photoMaisonVic, photosAsso, photosAutres, photosMaison } from './_images';
	import schema from './_schema.json';
</script>

<svelte:head>
	<title>La maison du Vic</title>
	<meta
		name="description"
		content="Gîte associatif pour l'accueil des activités et des projets collectifs"
	/>
	<meta property="og:title" content="La Maison du Vic" />
	<meta
		name="og:description"
		content="Gîte associatif pour initiatives locales, populaires, solidaires et sociales. "
	/>
	{@html `<script type="application/ld+json" >${JSON.stringify(schema)}<\/script>`}
</svelte:head>

<main>
	<div class="image">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
			<path
				opacity="0.33"
				d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
			/>
			<path
				opacity="0.66"
				d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
			/>
			<path
				d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"
			/>
		</svg>
		<img {...photoMaisonVic} type="image/webp" alt="Vue du hameau de la maison du vic" />
	</div>
	<header>
		<img height="130" src={logo} alt="Logo de l'association de la maison du vic : Vic et Vers Ça" />

		<h1>Bienvenue à la Maison du Vic</h1>
		<p class="lead">Gîte associatif pour initiatives locales, populaires, solidaires et sociales</p>
	</header>
	<Actualités />
	<nav>
		<a href="/#le-projet-associatif">Le projet</a> ·
		<a href="/#les-tarifs">Les tarifs</a> ·
		<a href="/#nous-trouver">Nous trouver</a> ·
		<a href="/#nous-contacter">Nous écrire</a>
	</nav>
	<Content>
		<Carrousel slot="photos asso" images={photosAsso} />
		<Carrousel slot="photos maison" images={photosMaison} />
		<Carrousel slot="photos autres" images={photosAutres} />
	</Content>
</main>

<style>
	header {
		z-index: 1;
		position: relative;
	}
	.lead {
		font-size: 120%;
	}
	.image {
		margin: -1rem;
		display: flex;
		align-items: center;
		max-height: 55vh;
		height: calc(1rem + 100vw * 270 / 360);
		position: relative;
		overflow: hidden;
	}
	@media (min-width: 600px) {
		.image {
			margin-top: 0;
		}
	}
	.image img {
		width: 100%;
		position: absolute;
		bottom: 0;
	}
	* > :global(header) {
		text-align: center;
	}
	svg {
		width: 300%;
		position: absolute;
		z-index: 1;
		max-height: 10rem;
		bottom: 0;
		left: -100px;
		transform: rotate(180deg);
	}
	path {
		fill: white;
	}
	nav {
		text-align: center;
		position: sticky;
		top: 0;
		padding: 0.6rem;
		margin: 0 -1rem;
		z-index: 1;
		background-color: var(--color);
		border-radius: 0.1rem;
		color: #ffffffee;
	}
	nav a {
		color: #ffffffee;
	}
</style>
