<script lang="ts">
  import { page } from '$app/stores';
  import { getContext, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import type { User } from '$lib/data/types';

  export let user: User | null | undefined;

  const isSidebarOpen = getContext('isSidebarOpen') as ReturnType<typeof writable>;
  const dispatch = createEventDispatcher();

  function toggleSidebar() {
    isSidebarOpen.update(value => !value);
  }
</script>

<Header {user} />

<main class="container-fluid py-4">
  <slot />
</main>

<header class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
  <div class="container-fluid">
    <slot />
    </div>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="/dashboard">Dashboard</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/cases">Cases</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/statutes">Statutes</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/users">Users</a>
                </li>
              </ul>
            </div>

            <div class="d-flex align-items-center">
              <slot />
              <button class="navbar-brand d-flex align-items-center btn btn-link" on:click={toggleSidebar}>
                <span class="navbar-toggler-icon me-2"></span>
                <h1 class="h5 mb-0 text-primary">WardenNet</h1>
              </button>

    <div class="d-flex flex-grow-1 justify-content-center mx-auto">
      <div class="input-group w-50">
        <input type="text" class="form-control" placeholder="Search" aria-label="Search" />
        <button class="btn btn-outline-secondary" type="button">🔍</button>
      </div>
      <span class="ms-3 text-muted d-none d-md-block">Assign to Users</span>
    </div>

    <div class="d-flex align-items-center">
      <button class="btn btn-primary me-2 d-none d-lg-block" on:click={() => dispatch('openNewCaseModal')}>Create New Case</button>
      <span class="badge bg-info text-dark me-2 d-none d-sm-block">Sintier</span>
      <button type="button" class="btn-close ms-1" aria-label="Close"></button>
    </div>

      {#if user}
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            {user.name || user.email}
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li><a class="dropdown-item" href="/profile">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <form action="/logout" method="POST">
                <button type="submit" class="dropdown-item">Logout</button>
              </form>
            </li>
          </ul>
        </div>
      {:else}
        <a href="/login" class="btn btn-outline-primary">Sign In</a>
      {/if}

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </div>
</header>

<style>
  /* No custom styles needed for Bootstrap 5 layout */
</style>

export const handle = async ({ event, resolve }) => {
  try {
    return await Auth.handle({ event, resolve });
  } catch (error) {
    console.error('Global error in hooks.server.ts:', error);
    return json({ error: 'Something went wrong', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
};


<!-- filepath: src/error.svelte -->
<script>
  export let error;
  export let status;
</script>
<div class="container mt-5">
  <h1 class="text-danger">Error {status}</h1>
  <p>{error?.message || 'An unexpected error occurred.'}</p>
  <a href="/" class="btn btn-primary mt-3">Go Home</a>
</div>

{#if error}
  <div class="alert alert-danger">{error}</div>
{/if}