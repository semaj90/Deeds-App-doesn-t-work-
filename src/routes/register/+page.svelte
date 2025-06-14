<!-- src/routes/register/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>Register</h1>

{#if form?.error}
  <p style="color: red;">{form.error}</p>
{/if}
{#if form?.message}
  <p style="color: green;">{form.message}</p>
{/if}

<form method="POST" use:enhance>
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required />
  </div>
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required />
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required minlength="8" />
  </div>
  <button type="submit">Register</button>
</form>

<p>Already have an account? <a href="/login">Login here</a></p>