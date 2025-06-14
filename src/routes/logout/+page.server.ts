import { signOut } from "@auth/sveltekit/actions";
import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = { default: signOut };

export async function load(event) {
  const session = await event.locals.getSession();
  if (!session?.user) {
    throw redirect(303, '/login');
  }
  return { user: session.user };
}

<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if $page.data.user}
  <p>Welcome, {$page.data.user.name || $page.data.user.email} (ID: {$page.data.user.id})!</p>
  <form action="/logout" method="POST">
    <button type="submit">Log Out</button>
  </form>
{:else}
  <p><a href="/login">Log In</a></p>
{/if}