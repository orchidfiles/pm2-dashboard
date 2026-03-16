import { mergeConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swcTransform from 'vite-plugin-swc-transform';
import baseConfig from '@pm2-dashboard/dev-kit/vitest';

const swcPlugin = swcTransform({
	suppressLegacyDecoratorNoExplicitUDFCFWarning: true,
	swcOptions: {
		jsc: {
			parser: {
				syntax: 'typescript',
				decorators: true
			},
			transform: {
				decoratorMetadata: true,
				legacyDecorator: true,
				useDefineForClassFields: false
			},
			target: 'es2022'
		}
	}
});

export default mergeConfig(baseConfig, {
	plugins: [tsconfigPaths(), swcPlugin],
	test: {
		server: {
			deps: {
				external: ['better-sqlite3']
			}
		},
		projects: [
			{
				plugins: [tsconfigPaths(), swcPlugin],
				test: {
					name: 'unit',
					include: ['tests/unit/**/*.test.ts'],
					globals: true,
					environment: 'node'
				}
			},
			{
				plugins: [tsconfigPaths(), swcPlugin],
				test: {
					name: 'integration',
					include: ['tests/integration/**/*.test.ts'],
					globals: true,
					environment: 'node',
					setupFiles: ['tests/integration/vitest.setup.ts'],
					testTimeout: 15000,
					sequence: {
						concurrent: false
					}
				}
			}
		]
	}
});
