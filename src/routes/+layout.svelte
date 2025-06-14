<script lang="ts">
  import Header from '$lib/components/+Header.svelte';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { userSessionStore } from '$lib/auth/userStore';

  export let data: PageData;

  $: if (browser && data.user !== undefined) {
    if (data.user) {
      userSessionStore.set({
        user: {
          id: data.user.id ?? '',
          name: data.user.name ?? '',
          email: data.user.email ?? '',
          image: data.user.image ?? undefined,
          username: data.user.username ?? '',
          role: data.user.role ?? ''
        },
        expires: null
      });
    } else {
      userSessionStore.set({ user: null, expires: null });
    }
  }

  if (typeof window !== 'undefined') {
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Client-side error caught by window.onerror:');
      console.error('Message:', message);
      console.error('Source:', source);
      console.error('Line:', lineno);
      console.error('Column:', colno);
      console.error('Error object:', error);
      return true;
    };
  }
</script>

<Header user={data.user} />

<main>
  <slot />
</main>