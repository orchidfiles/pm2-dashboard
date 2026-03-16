export interface Process {
	id: number;
	name: string;
	status: string;
	cpu: number;
	memory: number;
	uptime: number;
	restarts: number;
}

export interface BulkError {
	id: number;
	error: string;
}
