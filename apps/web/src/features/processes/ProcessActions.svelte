<script lang="ts">
import type { ProcessAction } from '@pm2-dashboard/shared';

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
			class="btn btn-sm preset-filled-surface-700"
			disabled={loading}
			onclick={() => onAction('start')}>
			Start
		</button>
	{/if}

	{#if status === 'online'}
		<button
			class="btn btn-sm preset-filled-surface-700"
			disabled={loading}
			onclick={() => onAction('stop')}>
			Stop
		</button>
	{/if}

	<button
		class="btn btn-sm preset-filled-surface-700"
		disabled={loading}
		onclick={() => onAction('restart')}>
		Restart
	</button>
</div>
