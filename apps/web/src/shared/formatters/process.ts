export class ProcessFormatter {
	public static memory(bytes: number): string {
		return `${Math.round(bytes / 1024 / 1024)} MB`;
	}

	public static uptime(ms: number): string {
		const sec = Math.floor((Date.now() - ms) / 1000);
		const h = Math.floor(sec / 3600);
		const m = Math.floor((sec % 3600) / 60);

		if (h > 0) {
			return `${h}h ${m}m`;
		}

		return `${m}m`;
	}

	public static statusPreset(status: string): string {
		const map: Record<string, string> = {
			online: 'preset-tonal-success',
			stopped: 'preset-tonal-surface'
		};

		return map[status] || 'preset-tonal-error';
	}
}
