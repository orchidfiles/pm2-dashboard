<script lang="ts">
import { onMount } from 'svelte';

import ProcessGrid from '$features/processes/ProcessGrid.svelte';
import AppFooter from '$layouts/AppFooter.svelte';
import AppHeader from '$layouts/AppHeader.svelte';
import { fetchProcesses } from '$shared/api/processes.api';

import type { Process } from '$shared/types/processes';

let processes: Process[] = $state([]);
let error: string | null = $state(null);
let loading = $state(true);

onMount(async () => {
	try {
		processes = await fetchProcesses();
	} catch (e) {
		error = e instanceof Error ? e.message : 'Unknown error';
	} finally {
		loading = false;
	}
});
</script>

<div class="min-h-screen flex flex-col bg-surface-950 text-surface-50">
	<AppHeader processCount={!loading && !error ? processes.length : null} />

	<main class="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
		<ProcessGrid processes={processes} loading={loading} error={error} />
	</main>

	<AppFooter />
</div>
