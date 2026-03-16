<script lang="ts">
import { ProcessAction } from '@pm2-dashboard/shared';

interface Props {
	loading: boolean;
	onAction: (action: ProcessAction) => void;
}

let { loading, onAction }: Props = $props();
</script>

<div class="btn-group flex gap-1">
	<button
		class="btn btn-sm preset-tonal-surface"
		disabled={loading}
		onclick={() => onAction(ProcessAction.Start)}>
		Start all
	</button>

	<button
		class="btn btn-sm preset-tonal-surface"
		disabled={loading}
		onclick={() => onAction(ProcessAction.Restart)}>
		Restart all
	</button>

	<button
		class="btn btn-sm preset-tonal-surface"
		disabled={loading}
		onclick={() => onAction(ProcessAction.Stop)}>
		Stop all
	</button>
</div>
