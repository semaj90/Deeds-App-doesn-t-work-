<script lang="ts"></script>
import { invalidate } from '$app/navigation';
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { createEventDispatcher } from 'svelte';

let title = '';
let description = '';
let dangerScore = 0;
let status = 'open';
let aiSummary = '';
let errorMsg = '';

const dispatch = createEventDispatcher();

async function handleSubmit(event: Event) {
  event.preventDefault();
  errorMsg = '';
  const res = await fetch('/cases/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, dangerScore, status, aiSummary })
  });
  if (res.ok) {
    const data = await res.json();
    goto(`/cases/${data.id}`);
  } else {
    errorMsg = (await res.json()).error || 'Failed to create case.';
  }
}
</script>

<h1>Create New Case</h1>
<form on:submit|preventDefault={handleSubmit}>
  <label>
    Title
    <input bind:value={title} required />
  </label>
  <label>
    Description
    <textarea bind:value={description} required></textarea>
  </label>
  <label>
    Danger Score
    <input type="number" bind:value={dangerScore} min="0" />
  </label>
  <label>
    Status
    <select bind:value={status}>
      <option value="open">Open</option>
      <option value="closed">Closed</option>
      <option value="pending">Pending</option>
    </select>
  </label>
  <label>
    AI Summary
    <textarea bind:value={aiSummary}></textarea>
  </label>
  {#if errorMsg}
    <div class="error">{errorMsg}</div>
  {/if}
  <button type="submit">Create Case</button>
</form>
