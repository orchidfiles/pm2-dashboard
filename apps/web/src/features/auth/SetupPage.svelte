<script lang="ts">
import { onMount } from 'svelte';

import { api } from '$shared/api';

interface Props {
	onSetupComplete: () => void;
}

const { onSetupComplete }: Props = $props();

let token = $state('');
let tokenValid = $state<boolean | null>(null);
let form = $state({ username: 'admin', password: '' });
let error = $state<string | null>(null);
let loading = $state(false);

onMount(async () => {
	token = new URLSearchParams(window.location.search).get('token') ?? '';

	if (!token) {
		tokenValid = false;

		return;
	}

	tokenValid = await api.auth.checkSetupToken(token);
});

async function handleSubmit(e: SubmitEvent) {
	e.preventDefault();

	error = null;
	loading = true;

	try {
		await api.auth.completeSetup(token, form.username, form.password);
		onSetupComplete();
	} catch (err) {
		error = err instanceof Error ? err.message : 'Setup failed';
	} finally {
		loading = false;
	}
}
</script>

<div class="h-dvh flex items-center justify-center bg-surface-950">
	<div class="card preset-tonal-surface border border-surface-700/30 p-8 w-full max-w-sm">
		<h1 class="h4 font-semibold mb-2 text-center">PM2 Dashboard</h1>
		<p class="text-sm text-surface-400 text-center mb-6">Initial setup</p>

		{#if tokenValid === null}
			<p class="text-sm text-surface-400 text-center">Verifying token…</p>
		{:else if tokenValid === false}
			<div class="card preset-tonal-error p-4 text-center">
				<p class="font-medium text-sm">Setup URL not found</p>
				<p class="text-sm opacity-70 mt-1">Open the setup URL printed in your terminal</p>
			</div>
		{:else}
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
						autocomplete="new-password"
						bind:value={form.password}
						disabled={loading}
						minlength="8"
						required />
				</label>

				{#if error}
					<p class="text-sm text-error-400">{error}</p>
				{/if}

				<button
					class="btn preset-filled-primary-500 w-full mt-2"
					type="submit"
					disabled={loading}>
					{loading ? 'Creating account…' : 'Create account'}
				</button>
			</form>
		{/if}
	</div>
</div>
