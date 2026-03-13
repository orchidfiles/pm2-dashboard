<script lang="ts">
interface Props {
	processCount?: number | null;
}

let { processCount = null }: Props = $props();
</script>

<header class="border-b border-surface-700/40 bg-surface-900/60 backdrop-blur-sm">
	<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="size-8 rounded-lg preset-filled-primary-500 flex items-center justify-center text-sm font-bold">P</div>
			<span class="font-semibold text-lg tracking-tight">PM2 Dashboard</span>
		</div>
		{#if processCount !== null}
			<span class="badge preset-tonal-surface text-xs">{processCount} processes</span>
		{/if}
	</div>
</header>
