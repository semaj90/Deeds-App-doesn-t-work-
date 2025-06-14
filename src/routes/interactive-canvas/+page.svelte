<script lang="ts">
  import Header from '$lib/components/+Header.svelte';
  import Sidebar from '$lib/components/+Sidebar.svelte';
  import FileUploadSection from '$lib/components/+FileUploadSection.svelte';
  import AutomateUploadSection from '$lib/components/+AutomateUploadSection.svelte';
  import AddNotesSection from '$lib/components/+AddNotesSection.svelte';
  interface PageData {
    user: any;
  }

  export let data: PageData;
</script>

<div class="interactive-canvas-layout">
  <Header user={data.user} />
  <Sidebar />
  <main class="main-content">
    <div class="content-grid">
      <FileUploadSection />
      <AutomateUploadSection />
      <AddNotesSection />
    </div>
    <div class="bottom-buttons">
      <button class="add-notes-button">
        <span class="icon">➕</span> Add Notes
      </button>
      <button class="ssteppr-button">Ssttepr</button>
    </div>
  </main>
</div>

<style>
  .interactive-canvas-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex-grow: 1;
    padding: 20px;
    margin-left: 250px; /* Adjust based on sidebar width */
    display: flex;
    flex-direction: column;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    gap: 20px;
    margin-bottom: 20px;
  }

  .bottom-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
    background-color: #fff;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
  }

  .add-notes-button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .ssteppr-button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
  }
</style>