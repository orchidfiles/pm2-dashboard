interface ApiErrorBody {
	message?: string;
	error?: string;
	errors?: string[];
}

export class ApiClient {
	static async get<T>(url: string): Promise<T> {
		const res = await fetch(url);

		if (!res.ok) {
			throw await ApiClient.buildError(res);
		}

		const data = await res.json();

		return data as T;
	}

	static async getOrNull<T>(url: string): Promise<T | null> {
		const res = await fetch(url);

		if (res.status === 401) {
			return null;
		}

		if (!res.ok) {
			throw await ApiClient.buildError(res);
		}

		const data = await res.json();

		return data as T;
	}

	static async post<T>(url: string, body?: unknown): Promise<T> {
		const res = await fetch(url, {
			method: 'POST',
			headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
			body: body !== undefined ? JSON.stringify(body) : undefined
		});

		if (!res.ok) {
			throw await ApiClient.buildError(res);
		}

		const data = await res.json();

		return data as T;
	}

	private static async buildError(res: Response): Promise<Error> {
		const json = await res.json().catch(() => ({}));
		const body = json as ApiErrorBody;
		const message = body.errors?.[0] ?? body.message ?? body.error ?? `HTTP ${res.status}`;

		return new Error(message);
	}
}
