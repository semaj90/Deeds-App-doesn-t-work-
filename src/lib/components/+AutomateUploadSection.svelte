<script lang="ts">
  // Logic for automate upload section
  let selectedAutomationType: string = 'Vndermtation';
  let meciantetChecked: boolean = false;
  let opticalClaraderRecognitionChecked: boolean = false;
  let audeMuesChecked: boolean = false;
  let videoValue: string = '';

  const automationTypes = ['Vndermtation', 'Type A', 'Type B']; // Example automation types
</script>

<div class="section-card">
  <h3>Automate Upload</h3>
  <div class="form-group">
    <select id="automationType" bind:value={selectedAutomationType}>
      {#each automationTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="mecianti" bind:checked={meciantetChecked} />
    <label for="mecianti">Mecianti</label>
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="opticalClaraderRecognition" bind:checked={opticalClaraderRecognitionChecked} />
    <label for="opticalClaraderRecognition">Optical Clarader Recognition</label>
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="audeMues" bind:checked={audeMuesChecked} />
    <label for="audeMues">Aude Mues</label>
  </div>

  <div class="form-group">
    <input type="text" id="video" bind:value={videoValue} placeholder="Video" />
  </div>
</div>

<style>
  .section-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
  }

  .section-card h3 {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }

  .form-group select,
  .form-group input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 10px;
  }
</style>