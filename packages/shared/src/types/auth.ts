export interface AuthUser {
	id: number;
	username: string;
	createdAt: string;
}

export interface CheckTokenResult {
	valid: boolean;
}

export type ActionResult = Record<string, never>;
