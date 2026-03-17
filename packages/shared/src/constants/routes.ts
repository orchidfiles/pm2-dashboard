export const routes = {
	auth: {
		me: '/api/auth/me',
		login: '/api/auth/login',
		logout: '/api/auth/logout'
	},
	setup: {
		status: '/api/setup/status',
		checkToken: (token: string) => `/api/setup?token=${encodeURIComponent(token)}`,
		complete: (token: string) => `/api/setup?token=${encodeURIComponent(token)}`
	},
	processes: {
		list: '/api/processes',
		action: (id: number, action: string) => `/api/processes/${id}/${action}`,
		bulkAction: (action: string) => `/api/processes/bulk/${action}`
	}
};
