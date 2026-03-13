import { createSvelteEslintConfig } from '@pm2-dashboard/dev-kit/eslint-svelte';

import svelteConfig from './svelte.config.js';

export default createSvelteEslintConfig({
	projectRoot: import.meta.dirname,
	svelteConfig,
	alias: {
		'$shared/*': ['./src/shared/*'],
		'$components/*': ['./src/components/*'],
		'$features/*': ['./src/features/*'],
		'$layouts/*': ['./src/layouts/*']
	},
	additionalRules: {
		'import-x/no-unresolved': ['error', { ignore: ['^virtual:icons/'] }]
	},
	additionalSvelteRules: {
		'import-x/no-unresolved': ['error', { ignore: ['^virtual:icons/'] }]
	}
});
