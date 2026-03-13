<script lang="ts">
interface Props {
	message?: string;
	error?: string | null;
}

let { message = 'No data', error = null }: Props = $props();
</script>

{#if error}
	<div class="card preset-tonal-error p-6 max-w-md mx-auto text-center">
		<p class="font-medium mb-1">Failed to load</p>
		<p class="text-sm opacity-70">{error}</p>
	</div>
{:else}
	<div class="card preset-tonal-surface p-12 text-center max-w-sm mx-auto">
		<p class="text-surface-400 text-sm">{message}</p>
	</div>
{/if}
