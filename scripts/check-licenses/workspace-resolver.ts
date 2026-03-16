import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { flatMap, reject } from 'lodash-es';

const root = resolve(import.meta.dirname, '../..');

export class WorkspaceResolver {
	static resolvePackageDirs(): string[] {
		const yaml = readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf-8');
		const patterns = this.parsePackagePatterns(yaml);
		const exclusions = patterns.filter((p) => p.startsWith('!')).map((p) => p.slice(1));
		const includes = reject(patterns, (p) => p.startsWith('!'));

		const dirs = flatMap(includes, (pattern) => this.expandGlob(pattern));

		return reject(dirs, (dir) => exclusions.some((exc) => this.matchesPattern(dir, exc)));
	}

	private static parsePackagePatterns(yaml: string): string[] {
		const lines = yaml.split('\n');
		const patterns: string[] = [];
		let inPackages = false;

		for (const line of lines) {
			if (line.startsWith('packages:')) {
				inPackages = true;
				continue;
			}

			if (inPackages) {
				if (!line.startsWith(' ') && line.trim() !== '') {
					inPackages = false;
					continue;
				}

				const match = /^\s+-\s+'([^']+)'/.exec(line);

				if (match) {
					patterns.push(match[1]);
				}
			}
		}

		return patterns;
	}

	private static expandGlob(pattern: string): string[] {
		const parts = pattern.split('/');
		const base = parts[0];
		const rest = parts.slice(1).join('/');

		if (!base) {
			return [];
		}

		if (!rest || rest === '*') {
			const baseDir = join(root, base);

			if (!existsSync(baseDir)) {
				return [];
			}

			if (!rest) {
				return [base];
			}

			return readdirSync(baseDir, { withFileTypes: true })
				.filter((e) => e.isDirectory())
				.map((e) => join(base, e.name));
		}

		return [join(base, rest)];
	}

	private static matchesPattern(dir: string, pattern: string): boolean {
		const parts = pattern.split('/');
		const base = parts[0];
		const rest = parts.slice(1).join('/');

		if (!rest || rest === '*') {
			return dir.startsWith(base + '/') || dir === base;
		}

		return dir === join(base, rest);
	}
}
