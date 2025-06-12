<script lang="ts">
  import { page } from '$app/stores';
  import { getContext, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  const isSidebarOpen = getContext('isSidebarOpen') as ReturnType<typeof writable>;
  const dispatch = createEventDispatcher();

  function toggleSidebar() {
    isSidebarOpen.update(value => !value);
  }
</script>

<header class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
  <div class="container-fluid">
    <button class="navbar-brand d-flex align-items-center btn btn-link" on:click={toggleSidebar}>
      <span class="navbar-toggler-icon me-2"></span> <!-- Bootstrap 5 menu icon -->
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
      <button class="btn btn-outline-secondary me-2 d-none d-md-block">Marsipiom</button>
      <button class="btn btn-outline-secondary me-2 d-none d-md-block">Diemwony</button>
      <span class="badge bg-info text-dark me-2 d-none d-sm-block">
        Sintier <button type="button" class="btn-close ms-1" aria-label="Close"></button>
      </span>
      <i class="bi bi-person-circle fs-4 me-2 text-dark"></i> <!-- User icon (requires Bootstrap Icons) -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </div>
</header>

<style>
  /* No custom styles needed for Bootstrap 5 layout */
</style>