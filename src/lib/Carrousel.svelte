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

<div>
	<div bind:this={carousel} class="carrousel" class:center={!isOverflowing}>
		{#each displayedImages as { srcset, alt, id } (id)}
			<img
				in:slide={{}}
				out:slide={{ direction: -1 }}
				animate:flip={{ duration: 400 }}
				{srcset}
				{alt}
				on:click={handleNext}
			/>
		{/each}
	</div>
</div>

<style>
	.carrousel {
		display: flex;
		margin: 0 min(-1rem, calc((var(--containerWidth) - 100vw) / 2));
		max-width: 100vw;
		overflow: hidden;
	}

	.center {
		justify-content: center;
	}
	.carrousel > :global(img) {
		max-height: 500px;
		will-change: transform;
		max-width: 100vw;
		padding: 1rem;
	}
</style>
