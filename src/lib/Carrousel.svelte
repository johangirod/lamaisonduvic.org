<script>
	import { bind, onMount } from 'svelte/internal';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';

	export let images;

	let carousel;
	let isOverflowing = false;
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

<div class="container" on:click={handleNext} role="button">
	<div bind:this={carousel} class="carrousel" class:center={!isOverflowing}>
		{#each displayedImages as { srcset, alt, id } (id)}
			<img in:slide out:slide={{ direction: -1 }} animate:flip={{ duration: 400 }} {srcset} {alt} />
		{/each}
	</div>
	{#if isOverflowing}
		<div class="next">➔</div>
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
		cursor: pointer;
	}
	.next {
		height: 100%;
		position: absolute;
		top: 0;
		justify-content: center;
		width: 1.5rem;
		padding: 0rem;
		right: -0.5rem;
		display: flex;
		align-items: center;
		background: white;
		transition: all 0.2s;
		color: var(--lightColor);
	}

	.carrousel {
		display: flex;
		overflow: hidden;
	}
	.container:hover .next {
		width: calc(1.5rem + 6px);
		color: var(--color);
	}

	.center {
		justify-content: center;
	}
	.carrousel > img {
		max-height: 500px;
		will-change: transform;
		max-width: 100vw;
		padding: 1rem;
	}
</style>
