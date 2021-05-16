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

	let xDown = null;
	function handleTouchStart(evt) {
		const touch = evt.touches[0];
		xDown = touch.clientX;
	}

	function handleTouchMove(evt) {
		if (!xDown || !yDown) {
			return;
		}

		const xUp = evt.touches[0].clientX;

		const xDiff = xDown - xUp;
		if (xDiff > 0) {
			/* left swipe */
		} else {
			handleNext();
			/* right swipe */
		}

		/* reset values */
		xDown = null;
		yDown = null;
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
			<img
				in:slide
				out:slide={{ direction: -1 }}
				animate:flip={{ duration: 400 }}
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				{srcset}
				{alt}
			/>
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

	@media (max-width: 600px) {
		.next {
			display: none;
		}
	}
</style>
