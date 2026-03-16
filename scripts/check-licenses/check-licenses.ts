import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { flatMap, groupBy, sortBy, uniq } from 'lodash-es';

import { WorkspaceResolver } from './workspace-resolver';

const root = resolve(import.meta.dirname, '../..');

const WORKSPACE_SCOPE = '@pm2-dashboard/';
const INTERNAL_NAMES = ['pm2-dashboard'];

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	license?: string | { type: string };
	licenses?: { type: string }[];
}

interface LicenseEntry {
	name: string;
	license: string;
}

class CheckLicenses {
	private workspaceDirs: string[];

	constructor() {
		this.workspaceDirs = WorkspaceResolver.resolvePackageDirs();
	}

	run(): void {
		const deps = this.collectDeps();
		const results = this.readLicenses(deps);

		this.print(results);
	}

	private collectDeps(): string[] {
		const allDeps = flatMap(this.workspaceDirs, (dir) => {
			const pkgPath = join(root, dir, 'package.json');

			if (!existsSync(pkgPath)) {
				return [];
			}

			const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as PackageJson;

			const deps: Record<string, string> = {
				...pkg.dependencies,
				...pkg.devDependencies
			};

			return Object.keys(deps).filter((name) => !this.isInternal(name));
		});

		return uniq(allDeps);
	}

	private isInternal(name: string): boolean {
		return name.startsWith(WORKSPACE_SCOPE) || INTERNAL_NAMES.includes(name);
	}

	private readLicenses(deps: string[]): LicenseEntry[] {
		return sortBy(
			deps.map((name) => ({ name, license: this.getLicense(name) })),
			'name'
		);
	}

	private getLicense(packageName: string): string {
		const pkgPath = this.findPackageJson(packageName);

		if (!pkgPath) {
			return 'NOT FOUND';
		}

		try {
			const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as PackageJson;

			if (typeof pkg.license === 'string') {
				return pkg.license;
			}

			if (typeof pkg.license === 'object' && pkg.license?.type) {
				return pkg.license.type;
			}

			if (Array.isArray(pkg.licenses) && pkg.licenses.length > 0) {
				return pkg.licenses.map((l) => l.type).join(', ');
			}

			return 'UNKNOWN';
		} catch {
			return 'PARSE ERROR';
		}
	}

	private findPackageJson(packageName: string): string | null {
		const candidates = [
			join(root, 'node_modules', packageName, 'package.json'),
			...this.workspaceDirs.map((dir) => join(root, dir, 'node_modules', packageName, 'package.json'))
		];

		return candidates.find(existsSync) ?? null;
	}

	private print(results: LicenseEntry[]): void {
		const maxNameLen = Math.max(...results.map((r) => r.name.length));
		const grouped = groupBy(results, 'license');

		console.log(`\nTotal unique dependencies: ${results.length}\n`);
		console.log('='.repeat(60));

		for (const [license, packages] of sortBy(Object.entries(grouped), 0)) {
			console.log(`\n${license} (${packages.length})`);

			for (const { name } of sortBy(packages, 'name')) {
				console.log(`  ${name}`);
			}
		}

		console.log('\n' + '='.repeat(60));
		console.log('\nFull list (alphabetical):\n');

		for (const { name, license } of results) {
			console.log(`  ${name.padEnd(maxNameLen + 2)}${license}`);
		}
	}
}

new CheckLicenses().run();
