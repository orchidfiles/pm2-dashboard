<script lang="ts">
import type { ProcessAction } from '$shared/types/processes';

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
		onclick={() => onAction('start')}>
		Start all
	</button>

	<button
		class="btn btn-sm preset-tonal-surface"
		disabled={loading}
		onclick={() => onAction('restart')}>
		Restart all
	</button>

	<button
		class="btn btn-sm preset-tonal-surface"
		disabled={loading}
		onclick={() => onAction('stop')}>
		Stop all
	</button>
</div>
