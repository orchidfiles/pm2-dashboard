<script lang="ts">
import { api } from '$shared/api';

interface Props {
	onLogin: () => void;
}

const { onLogin }: Props = $props();

let form = $state({ username: '', password: '' });
let error = $state<string | null>(null);
let loading = $state(false);

async function handleSubmit(e: SubmitEvent) {
	e.preventDefault();

	error = null;
	loading = true;

	try {
		await api.auth.login(form.username, form.password);
		onLogin();
	} catch (err) {
		error = err instanceof Error ? err.message : 'Login failed';
	} finally {
		loading = false;
	}
}
</script>

<div class="h-dvh flex items-center justify-center bg-surface-950">
	<div class="card preset-tonal-surface border border-surface-700/30 p-8 w-full max-w-sm">
		<h1 class="h4 font-semibold mb-6 text-center">PM2 Dashboard</h1>

		<form
			onsubmit={handleSubmit}
			class="flex flex-col gap-4">
			<label class="label">
				<span class="label-text">Username</span>
				<input
					class="input"
					type="text"
					autocomplete="username"
					bind:value={form.username}
					disabled={loading}
					required />
			</label>

			<label class="label">
				<span class="label-text">Password</span>
				<input
					class="input"
					type="password"
					autocomplete="current-password"
					bind:value={form.password}
					disabled={loading}
					required />
			</label>

			{#if error}
				<p class="text-sm text-error-400">{error}</p>
			{/if}

			<button
				class="btn preset-filled-primary-500 w-full mt-2"
				type="submit"
				disabled={loading}>
				{loading ? 'Signing in…' : 'Sign in'}
			</button>
		</form>
	</div>
</div>
