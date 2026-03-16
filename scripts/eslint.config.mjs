import base from '@pm2-dashboard/dev-kit/eslint';

export default [
	...base,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname
			}
		}
	}
];
