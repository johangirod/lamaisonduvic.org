import yaml from '@rollup/plugin-yaml';
import vercel from '@sveltejs/adapter-vercel';
import preprocessMarkdown from 'svelte-preprocess-markdown';
import imagetools from 'vite-imagetools';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocessMarkdown.markdown({ headerIds: true }),
	extensions: ['.svelte', '.md'],

	kit: {
		adapter: vercel(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [imagetools.imagetools({ force: true }), yaml()]
		}
	}
};

export default config;
