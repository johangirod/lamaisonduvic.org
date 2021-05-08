import vercel from '@sveltejs/adapter-vercel';
// const pkg = require('./package.json');
import preprocessMarkdown from 'svelte-preprocess-markdown';
import imagetools from 'vite-imagetools';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocessMarkdown.markdown(),
	extensions: ['.svelte', '.md'],

	kit: {
		adapter: vercel(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [imagetools.imagetools({ force: true })]
		}
	}
};

export default config;
