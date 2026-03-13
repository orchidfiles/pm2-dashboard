<script lang="ts">
import ProcessesPage from '$features/processes/ProcessesPage.svelte';
import AppFooter from '$layouts/AppFooter.svelte';
import AppHeader from '$layouts/AppHeader.svelte';
</script>

<div class="h-dvh flex flex-col bg-surface-950 text-surface-50">
	<AppHeader />

	<main class="flex-1 flex flex-col min-h-0">
		<ProcessesPage />
	</main>

	<AppFooter />
</div>
