<script lang="ts">
import { ProcessFormatter } from '$shared/formatters/process';

import ProcessActions from './ProcessActions.svelte';

import type { Process, ProcessAction } from '@pm2-dashboard/shared';

interface Props {
	process: Process;
	onAction: (id: number, action: ProcessAction) => Promise<void>;
}

let { process: proc, onAction }: Props = $props();

let actionLoading = $state(false);

async function handleAction(action: ProcessAction) {
	actionLoading = true;

	try {
		await onAction(proc.id, action);
	} finally {
		actionLoading = false;
	}
}
</script>

<div class="card preset-tonal-surface border border-surface-700/30 p-5 flex flex-col gap-4">
	<div class="flex items-start justify-between gap-2">
		<div class="flex flex-col gap-0.5 min-w-0">
			<span class="font-semibold text-sm truncate">{proc.name}</span>
			<span class="text-xs text-surface-400">pid #{proc.id}</span>
		</div>
		<span class="badge {ProcessFormatter.statusPreset(proc.status)} text-xs shrink-0 capitalize">
			{proc.status}
		</span>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<div class="card preset-filled-surface-800 p-3 rounded-lg flex flex-col gap-1">
			<span class="text-[10px] uppercase tracking-widest text-surface-400 font-medium">CPU</span>
			<span class="text-lg font-semibold tabular-nums"
				>{proc.cpu ?? 0}<span class="text-xs text-surface-400 ml-0.5">%</span></span>
		</div>
		<div class="card preset-filled-surface-800 p-3 rounded-lg flex flex-col gap-1">
			<span class="text-[10px] uppercase tracking-widest text-surface-400 font-medium">Memory</span>
			<span class="text-lg font-semibold tabular-nums">{proc.memory ? ProcessFormatter.memory(proc.memory) : '—'}</span>
		</div>
		<div class="card preset-filled-surface-800 p-3 rounded-lg flex flex-col gap-1">
			<span class="text-[10px] uppercase tracking-widest text-surface-400 font-medium">Uptime</span>
			<span class="text-sm font-medium">{proc.uptime ? ProcessFormatter.uptime(proc.uptime) : '—'}</span>
		</div>
		<div class="card preset-filled-surface-800 p-3 rounded-lg flex flex-col gap-1">
			<span class="text-[10px] uppercase tracking-widest text-surface-400 font-medium">Restarts</span>
			<span class="text-lg font-semibold tabular-nums">{proc.restarts ?? 0}</span>
		</div>
	</div>

	<ProcessActions
		status={proc.status}
		loading={actionLoading}
		onAction={handleAction} />
</div>
