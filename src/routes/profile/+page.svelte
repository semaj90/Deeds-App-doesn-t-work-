<script lang="ts">
  import { page } from '$app/stores';
  let user = $page.data.session?.user;
</script>

<svelte:head>
  <title>User Profile</title>
</svelte:head>

<div class="container mt-5 max-w-xl mx-auto bg-base-100 rounded-lg shadow p-6">
  <div class="flex flex-col items-center gap-4">
    {#if user?.image}
      <img src={user.image} alt="Profile" class="rounded-full border-2 border-primary" style="width:96px;height:96px;object-fit:cover;" />
    {:else}
      <div class="rounded-full bg-primary text-white flex items-center justify-center" style="width:96px;height:96px;font-size:2.5rem;">
        {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : '?'}
      </div>
    {/if}
    <h2 class="text-2xl font-bold">{user?.name || 'No Name'}</h2>
    <p class="text-base-content/70">{user?.email}</p>
    <div class="divider"></div>
    <div class="w-full">
      <h3 class="font-semibold mb-2">Account Details</h3>
      <ul class="list-disc pl-6">
        <li><b>Username:</b> {user?.username || '-'}</li>
        <li><b>Role:</b> {user?.role || '-'}</li>
      </ul>
    </div>
  </div>
</div>

<style>
.container {
  min-height: 60vh;
}
</style>
