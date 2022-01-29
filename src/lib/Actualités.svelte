<script>
	import { fade } from 'svelte/transition';
	import actus from './actualités.yaml';
</script>

<section>
	<h2>Actualités</h2>
	<ul>
		{#each actus as { description, quand, titre, action }}
			<li transition:fade>
				<div class="bordered">
					<span class="date">{quand}</span><br />
					<strong>{titre}</strong>
					{description}<br />
				</div>
				<div class="action">
					<small><a class="button" target="_blank" href={action.url}>{action.nom}</a></small>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	:root {
		--borderWidth: 3px;
	}

	h2 {
		text-align: center;
	}
	section {
		border-top-left-radius: 0.3rem;
		border-top-right-radius: 0.3rem;
		border: var(--borderWidth) solid var(--lightColor);
		border-bottom: none;
		padding: 0.5rem 1rem;
		margin: 0 -1rem;
	}
	.date {
		color: var(--titleColor);
		font-size: 80%;
	}

	ul {
		list-style: none;
		padding: 0;
		margin-left: -1rem;
		margin-bottom: 2rem;
	}
	.action {
		text-align: right;
	}

	.bordered {
		border-left: var(--borderWidth) solid var(--color);
		padding-left: 1rem;
		margin-left: calc(-1 * var(--borderWidth));
	}
	@media (max-width: 800px) {
		section {
			border-color: transparent;
		}
	}
</style>
