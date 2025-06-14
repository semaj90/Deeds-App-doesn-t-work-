<script lang="ts">
  import type { PageData } from './$types';
  import CaseCard from '$lib/components/+CaseCard.svelte';
  import { enhance } from '$app/forms';

  export let data: PageData;

  let searchTerm = '';
  let statusFilter = 'all';
</script>

<div class="container mt-4">
  <h1>Cases</h1>
  <p>List of cases will go here.</p>
</div>