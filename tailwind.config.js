/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: '#222451',
				secondary: '#B7352A',
				accent: '#C7902A',
				sonaeblue: '#222451',
				inprogress: '#EFD237',
				finish: '#2C702C',
				error: '#B7352A'
			}
		}
	}
};
