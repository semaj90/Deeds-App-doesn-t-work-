<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { session as userSessionStore } from '$lib/auth/userStore'; // Assuming this is your client-side store

	export let data: PageData; // PageData for the layout
	
	// Synchronize the client-side userStore with the user data from the server
	$: if (browser && data.user !== undefined) {
		if (data.user) {
			userSessionStore.set({
				user: { // Ensure these fields match your userStore's expected structure
					id: data.user.id ?? '', // Provide default empty string for id
					name: data.user.name ?? '',
					email: data.user.email ?? '',
					image: data.user.image ?? undefined,
					username: data.user.username ?? '',
					role: data.user.role ?? '' // Add role
				},
				expires: null // Session expires is not directly passed, set to null or handle as needed
			});
		} else {
			userSessionStore.set({ user: null, expires: null });
		}
	}

	// Global error handler for client-side errors
	if (typeof window !== 'undefined') {
		window.onerror = function(message, source, lineno, colno, error) {
			console.error('Client-side error caught by window.onerror:');
			console.error('Message:', message);
			console.error('Source:', source);
			console.error('Line:', lineno);
			console.error('Column:', colno);
			console.error('Error object:', error);
			// Return true to prevent the default browser error handling
			return true;
		};
	}
</script>

<!-- Temporary debug output -->
{#if data.user}
	<div style="background: #222; color: lime; padding: 10px; position: fixed; top: 0; left: 0; z-index: 9999;">
		<pre>Current User: {JSON.stringify(data.user, null, 2)}</pre>
	</div>
{/if}

<nav>
	<a href="/">Home</a>
	{#if data.user}
		<span>Welcome, {data.user.name || data.user.username || data.user.email}!</span>
		<form action="/logout" method="POST">
			<button type="submit" style="background: transparent; border: none; color: blue; text-decoration: underline; cursor: pointer; padding: 0; margin-left: 10px;">Logout</button>
		</form>
	{:else}
		<a href="/login" style="margin-left: 10px;">Sign In</a>
	{/if}
</nav>

<main>
	<slot />
</main>