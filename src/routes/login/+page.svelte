<h2>Login</h2>
<form method="POST" action="/api/auth/signin/credentials?callbackUrl=/dashboard">
	<div class="mb-3">
		<label for="email" class="form-label">Email</label>
		<input name="email" id="email" type="email" class="form-control" required placeholder="your@email.com" />
	</div>
	<div class="mb-3">
		<label for="password" class="form-label">Password</label>
		<input name="password" id="password" type="password" class="form-control" required />
	</div>
	<button type="submit" class="btn btn-primary">Sign In</button>
</form>

{#if error}
	<div class="alert alert-danger">{error}</div>
{/if}

<script lang="ts">
let error = '';
</script>

<!--
  Use SvelteKit's form actions for login, which POSTs to /api/auth/[...auth]?auth=login
  and handles errors and redirects in a Svelte-native way.
-->