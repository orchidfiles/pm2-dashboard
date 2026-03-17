<script lang="ts">
import { onMount } from 'svelte';

import LoginPage from '$features/auth/LoginPage.svelte';
import SetupPage from '$features/auth/SetupPage.svelte';
import ProcessesPage from '$features/processes/ProcessesPage.svelte';
import AppFooter from '$layouts/AppFooter.svelte';
import AppHeader from '$layouts/AppHeader.svelte';
import { api } from '$shared/api';

type AppState = 'loading' | 'setup' | 'login' | 'app';

let appState = $state<AppState>('loading');

const isSetupPath = window.location.pathname === '/setup';

onMount(async () => {
	if (isSetupPath) {
		appState = 'setup';

		return;
	}

	try {
		const setupStatus = await api.auth.getSetupStatus();

		if (!setupStatus.completed) {
			appState = 'setup';

			return;
		}

		const user = await api.auth.getMe();

		if (user) {
			appState = 'app';
		} else {
			appState = 'login';
		}
	} catch {
		appState = 'login';
	}
});

function handleLogin() {
	appState = 'app';
}

function handleSetupComplete() {
	appState = 'app';
	history.replaceState(null, '', '/');
}
</script>

{#if appState === 'loading'}
	<div class="h-dvh flex items-center justify-center bg-surface-950">
		<div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
	</div>
{:else if appState === 'setup'}
	<SetupPage onSetupComplete={handleSetupComplete} />
{:else if appState === 'login'}
	<LoginPage onLogin={handleLogin} />
{:else}
	<div class="h-dvh flex flex-col bg-surface-950 text-surface-50">
		<AppHeader />

		<main class="flex-1 flex flex-col min-h-0">
			<ProcessesPage />
		</main>

		<AppFooter />
	</div>
{/if}
