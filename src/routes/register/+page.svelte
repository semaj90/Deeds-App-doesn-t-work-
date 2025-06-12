<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<form method="POST" class="container mt-5">
	<h2>Register</h2>

	{#if form?.error}
		<div class="alert alert-danger" role="alert">
			{form.error}
		</div>
	{/if}

	<div class="mb-3">
		<label for="email" class="form-label">Email</label>
		<input id="email" class="form-control" type="email" name="email" required />
	</div>
	<div class="mb-3">
		<label for="password" class="form-label">Password</label>
		<input id="password" class="form-control" type="password" name="password" required />
	</div>

	<button type="submit" class="btn btn-primary">Register</button>

	<p class="mt-3">
		Already have an account? <a href="/login">Login here</a>.
	</p>
</form>