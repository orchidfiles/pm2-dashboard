<script lang="ts">
import { onMount } from 'svelte';

interface Process {
	id: number;
	name: string;
	status: string;
	cpu: number;
	memory: number;
	uptime: number;
	restarts: number;
}

let processes: Process[] = $state([]);
let error: string | null = $state(null);

onMount(async () => {
	try {
		const res = await fetch('/api/processes');

		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		processes = await res.json();
	} catch (e) {
		error = e instanceof Error ? e.message : 'Unknown error';
	}
});

function formatMemory(bytes: number): string {
	return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function formatUptime(ms: number): string {
	const sec = Math.floor((Date.now() - ms) / 1000);
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);

	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function statusClass(status: string): string {
	if (status === 'online') return 'bg-green-950 text-green-400';
	if (status === 'stopped') return 'bg-zinc-800 text-zinc-400';

	return 'bg-red-950 text-red-400';
}
</script>

<main class="min-h-screen bg-zinc-950 text-slate-200 p-8 font-sans">
	<h1 class="text-2xl font-semibold mb-6">PM2 Dashboard</h1>

	{#if error}
		<p class="text-red-400">{error}</p>
	{:else if processes.length === 0}
		<p class="text-slate-500">No processes found.</p>
	{:else}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
			{#each processes as proc (proc.id)}
				<div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
					<div class="flex justify-between items-center mb-3">
						<span class="font-semibold text-sm truncate">{proc.name}</span>
						<span class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 {statusClass(proc.status)}">
							{proc.status}
						</span>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div class="flex flex-col gap-0.5">
							<span class="text-xs text-slate-500 uppercase tracking-wide">CPU</span>
							<span class="text-sm font-medium">{proc.cpu ?? 0}%</span>
						</div>
						<div class="flex flex-col gap-0.5">
							<span class="text-xs text-slate-500 uppercase tracking-wide">Memory</span>
							<span class="text-sm font-medium">{proc.memory ? formatMemory(proc.memory) : '—'}</span>
						</div>
						<div class="flex flex-col gap-0.5">
							<span class="text-xs text-slate-500 uppercase tracking-wide">Uptime</span>
							<span class="text-sm font-medium">{proc.uptime ? formatUptime(proc.uptime) : '—'}</span>
						</div>
						<div class="flex flex-col gap-0.5">
							<span class="text-xs text-slate-500 uppercase tracking-wide">Restarts</span>
							<span class="text-sm font-medium">{proc.restarts ?? 0}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>
