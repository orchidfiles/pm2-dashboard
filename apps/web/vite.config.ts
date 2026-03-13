import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../infra/env', '');
	const apiPort = Number(env.API_PORT) || 3100;
	const webPort = Number(env.WEB_PORT) || 3101;

	return {
		plugins: [tailwindcss(), svelte()],
		server: {
			port: webPort,
			proxy: {
				'/api': `http://localhost:${apiPort}`
			}
		}
	};
});
