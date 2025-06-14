<script lang="ts">
	import { enhance } from "$app/forms";
	let name = '';
	let email = '';
	let password = '';
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="name">Name</label>
	<input name="name" id="name" bind:value={name} required /><br />
	<label for="email">Email</label>
	<input type="email" name="email" id="email" bind:value={email} required /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={password} required /><br />
	<input type="submit" />
</form>
<a href="/login">Sign in</a>