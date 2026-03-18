<script lang="ts">
import { ProcessAction } from '@pm2-dashboard/shared/frontend';

interface Props {
	status: string;
	loading: boolean;
	onAction: (action: ProcessAction) => void;
}

let { status, loading, onAction }: Props = $props();
</script>

<div class="btn-group flex gap-1">
	{#if status !== 'online'}
		<button
			class="btn btn-sm preset-outlined-surface-400-600"
			disabled={loading}
			onclick={() => onAction(ProcessAction.Start)}>
			Start
		</button>
	{/if}

	{#if status === 'online'}
		<button
			class="btn btn-sm preset-outlined-surface-400-600"
			disabled={loading}
			onclick={() => onAction(ProcessAction.Stop)}>
			Stop
		</button>
	{/if}

	{#if status === 'online'}
		<button
			class="btn btn-sm preset-outlined-surface-400-600"
			disabled={loading}
			onclick={() => onAction(ProcessAction.Restart)}>
			Restart
		</button>
	{/if}
</div>
