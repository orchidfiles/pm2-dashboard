<script lang="ts">
import EmptyState from '$components/ui/EmptyState.svelte';
import Spinner from '$components/ui/Spinner.svelte';

import ProcessCard from './ProcessCard.svelte';

import type { Process, ProcessAction } from '@pm2-dashboard/shared/frontend';

interface Props {
	processes: Process[];
	loading: boolean;
	error: string | null;
	onAction: (id: number, action: ProcessAction) => Promise<void>;
}

let { processes, loading, error, onAction }: Props = $props();
</script>

{#if loading}
	<Spinner />
{:else if error}
	<EmptyState error={error} />
{:else if processes.length === 0}
	<EmptyState message="No processes found" />
{:else}
	<div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
		{#each processes as proc (proc.id)}
			<ProcessCard
				process={proc}
				onAction={onAction} />
		{/each}
	</div>
{/if}
