import { fileURLToPath, URL } from 'node:url';

import { Infra } from '@pm2-dashboard/shared';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, Infra.findInfraEnvDir(), '');
	const apiPort = Number(env.API_PORT) || 3100;
	const webPort = Number(env.WEB_PORT) || 3101;

	return {
		plugins: [tailwindcss(), svelte(), Icons({ compiler: 'svelte', autoInstall: false })],
		resolve: {
			alias: {
				$shared: fileURLToPath(new URL('./src/shared', import.meta.url)),
				$components: fileURLToPath(new URL('./src/components', import.meta.url)),
				$features: fileURLToPath(new URL('./src/features', import.meta.url)),
				$layouts: fileURLToPath(new URL('./src/layouts', import.meta.url))
			}
		},
		server: {
			port: webPort,
			proxy: {
				'/api': `http://localhost:${apiPort}`
			}
		}
	};
});
