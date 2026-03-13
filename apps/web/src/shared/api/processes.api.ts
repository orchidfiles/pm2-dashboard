import type { Process, ProcessAction } from '$shared/types/processes';

interface ApiErrorBody {
	error?: string;
}

async function parseErrorBody(res: Response): Promise<string> {
	const body = (await res.json().catch(() => ({}))) as ApiErrorBody;

	return body.error ?? `HTTP ${res.status}`;
}

export async function fetchProcesses(): Promise<Process[]> {
	const res = await fetch('/api/processes');

	if (!res.ok) throw new Error(`HTTP ${res.status}`);

	return res.json();
}

export async function performAction(id: number, action: ProcessAction): Promise<void> {
	const res = await fetch(`/api/processes/${id}/${action}`, { method: 'POST' });

	if (!res.ok) {
		throw new Error(await parseErrorBody(res));
	}
}

export async function bulkAction(ids: number[], action: ProcessAction): Promise<void> {
	const res = await fetch('/api/processes/bulk', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action, ids })
	});

	if (!res.ok) {
		throw new Error(await parseErrorBody(res));
	}
}
