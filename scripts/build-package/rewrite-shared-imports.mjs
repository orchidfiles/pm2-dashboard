#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

class SharedImportsRewriter {
	static SPECIFIER = '@pm2-dashboard/shared';

	static run() {
		const scriptDir = dirname(fileURLToPath(import.meta.url));
		const packageDir = join(scriptDir, '..', '..', 'packages', 'pm2-dashboard');
		const apiDistDir = join(packageDir, 'dist', 'api');
		const sharedIndexPath = join(packageDir, 'dist', 'shared', 'index.js');

		const files = this.collectJsFiles(apiDistDir);
		let rewrittenCount = 0;

		for (const file of files) {
			const original = readFileSync(file, 'utf8');

			if (!original.includes(this.SPECIFIER)) {
				continue;
			}

			const relSpecifier = this.toRelativeSpecifier(file, sharedIndexPath);
			const updated = original.replaceAll(`'${this.SPECIFIER}'`, `'${relSpecifier}'`);

			if (updated !== original) {
				writeFileSync(file, updated, 'utf8');
				rewrittenCount++;
			}
		}

		console.log(`Rewrote @pm2-dashboard/shared imports in ${rewrittenCount} file(s).`);
	}

	static collectJsFiles(dir) {
		const results = [];
		const entries = readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dir, entry.name);

			if (entry.isDirectory()) {
				results.push(...this.collectJsFiles(fullPath));
			} else if (entry.isFile() && entry.name.endsWith('.js')) {
				results.push(fullPath);
			}
		}

		return results;
	}

	static toRelativeSpecifier(fromFile, toFile) {
		const fromDir = dirname(fromFile);
		let rel = relative(fromDir, toFile);

		if (!rel.startsWith('.')) {
			rel = `./${rel}`;
		}

		return rel;
	}
}

SharedImportsRewriter.run();
