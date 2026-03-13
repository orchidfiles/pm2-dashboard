import type { Process } from '$shared/types/processes';

export async function fetchProcesses(): Promise<Process[]> {
	const res = await fetch('/api/processes');

	if (!res.ok) throw new Error(`HTTP ${res.status}`);

	return res.json();
}
