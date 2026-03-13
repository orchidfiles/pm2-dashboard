import { createSvelteEslintConfig } from '@pm2-dashboard/dev-kit/eslint-svelte';

import svelteConfig from './svelte.config.js';

export default createSvelteEslintConfig({
	projectRoot: import.meta.dirname,
	svelteConfig
});
