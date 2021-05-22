<script>
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte/internal';

	export let images;

	let carousel;
	let isOverflowing = true;
	let displayedImages = images.map((img, id) => ({ ...img, id }));
	onMount(() => {
		isOverflowing = carousel.clientWidth < carousel.scrollWidth;
	});
	function handleNext() {
		if (!isOverflowing) {
			return;
		}
		const [first, ...rest] = displayedImages;
		displayedImages = [...rest, { ...first, id: rest[rest.length - 1].id + 1 }];
	}

	function slide(_, params) {
		const direction = params.direction || 1;
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || cubicOut,
			css: (t, u) => {
				return `
					transform: translateX(${direction * u * 100}%);
					opacity: ${t};`;
			}
		};
	}
</script>

<div class="container" role="button" class:isOverflowing>
	<div bind:this={carousel} class="carrousel">
		{#each displayedImages as { srcset, alt, id } (id)}
			<img
				in:slide={{ direction: 1, duration: 500 }}
				out:slide={{ direction: -1, duration: 500 }}
				animate:flip={{ duration: 500 }}
				on:click={handleNext}
				{srcset}
				{alt}
			/>
		{/each}
	</div>
	{#if isOverflowing}
		<div class="next">
			<button on:click={handleNext}>➔</button>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 100vw;
		z-index: 0;
		position: relative;
		background-color: white;
		margin: 0 min(-1rem, calc((var(--containerWidth) - 100vw) / 2));
		position: relative;
	}

	.carrousel {
		display: flex;
		overflow: hidden;
	}
	.container:hover .next {
		color: var(--color);
	}

	.container:not(.isOverflowing) {
		justify-content: center;
	}

	.carrousel > img {
		height: 500px;
		max-height: 80vw;
		will-change: transform;
		max-width: 100vw;
		object-fit: cover;
		object-position: center;
		cursor: pointer;
		padding: 1rem;
	}

	.container:not(.isOverflowing) .next {
		display: none;
	}
	.next {
		display: flex;
		width: 100%;
		position: absolute;

		margin-top: -0.5rem;
		color: var(--color);
		align-items: center;
		justify-content: center;
		background: white;
		transition: all 0.2s;
	}

	.next button {
		border: none;
		color: inherit;

		background: none;
		font-size: inherit;
		font-weight: inherit;
		font-family: inherit;
		cursor: pointer;
	}
	@media (min-width: 800px) {
		.next {
			height: 100%;
			color: var(--lightColor);
			position: absolute;
			top: 0;
			max-width: 1rem;
			margin-top: 0;

			padding: 0rem;
			right: 0rem;
		}
		.next button {
			margin-left: 0.5rem;
		}
	}
</style>
