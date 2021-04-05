const vercel = require('@sveltejs/adapter-node');
const pkg = require('./package.json');
const { markdown } = require('svelte-preprocess-markdown');

const imagetools = require('vite-imagetools');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	preprocess: markdown(),
	extensions: ['.svelte', '.md'],

	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: vercel(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			},
			plugins: [imagetools({ force: true })]
		}
	}
};

// const { markdown } = require("svelte-preprocess-markdown");
// const vercel = require("@sveltejs/adapter-vercel");
// const pkg = require("./package.json");
// const imagetools = require("vite-imagetools");

// /** @type {import('@sveltejs/kit').Config} */
// module.exports = {
//   // Consult https://github.com/sveltejs/svelte-preprocess
//   // for more information about preprocessors
//   preprocess: markdown(),
//   extensions: [".svelte", ".md"],
//   kit: {
//     adapter: vercel(),

//     // hydrate the <div id="svelte"> element in src/app.html
//     target: "#svelte",

//     vite: {
//       ssr: {
//         noExternal: Object.keys(pkg.dependencies || {}),
//       },
//       plugins: [imagetools({ force: true })],
//     },
//   },
// };
