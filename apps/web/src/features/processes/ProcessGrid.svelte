<script lang="ts">
import EmptyState from '$components/ui/EmptyState.svelte';
import Spinner from '$components/ui/Spinner.svelte';

import ProcessCard from './ProcessCard.svelte';

import type { Process } from '$shared/types/processes';

interface Props {
	processes: Process[];
	loading: boolean;
	error: string | null;
}

let { processes, loading, error }: Props = $props();
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
			<ProcessCard process={proc} />
		{/each}
	</div>
{/if}
