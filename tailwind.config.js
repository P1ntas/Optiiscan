/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		colors: {
			primary: 'oklch(var(--primary))',
			secondary: 'oklch(var(--secondary))',
			accent: 'oklch(var(--accent))'
		},
		extend: {}
	},
	plugins: [require('daisyui'), require('flowbite/plugin')],
	daisyui: {
		themes: [
			{
				custom: {
					primary: '#222451',
					secondary: '#B7352A',
					accent: '#C7902A'
				}
			},
			'custom'
		]
	}
};
