<script lang="ts">
import { onMount } from 'svelte';

import { api } from '$shared/api';

import BulkActions from './BulkActions.svelte';
import ProcessGrid from './ProcessGrid.svelte';

import type { Process, ProcessAction } from '@pm2-dashboard/shared/frontend';

let processes: Process[] = $state([]);
let error: string | null = $state(null);
let loading = $state(true);
let bulkLoading = $state(false);

async function loadProcesses() {
	try {
		processes = await api.processes.fetchProcesses();
		error = null;
	} catch (e) {
		error = e instanceof Error ? e.message : 'Unknown error';
	} finally {
		loading = false;
	}
}

async function handleAction(id: number, action: ProcessAction) {
	await api.processes.performAction(id, action);
	await loadProcesses();
}

async function handleBulkAction(action: ProcessAction) {
	bulkLoading = true;

	try {
		await api.processes.bulkAction(action);
		await loadProcesses();
	} finally {
		bulkLoading = false;
	}
}

onMount(loadProcesses);
</script>

<div class="flex flex-col flex-1 min-h-0">
	{#if !loading && !error && processes.length > 0}
		<div class="border-b border-surface-700/40 shrink-0">
			<div class="max-w-6xl w-full mx-auto px-6 py-3 flex justify-end">
				<BulkActions
					loading={bulkLoading}
					onAction={handleBulkAction} />
			</div>
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto scrollbar-none">
		<div class="max-w-6xl w-full mx-auto px-6 py-8">
			<ProcessGrid
				processes={processes}
				loading={loading}
				error={error}
				onAction={handleAction} />
		</div>
	</div>
</div>
