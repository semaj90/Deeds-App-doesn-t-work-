<script lang="ts">
  // Logic for add notes section
  let selectedStrew: string = 'Strew';
  let selectedIndow: string = 'Indow';
  let opticalCtaraderRecognittionChecked: boolean = false;
  let audeMuesChecked: boolean = false;
  let videonValue: string = '';

  const strewOptions = ['Strew', 'Option 1', 'Option 2']; // Example options
  const indowOptions = ['Indow', 'Option A', 'Option B']; // Example options
</script>

<div class="section-card">
  <h3>Add Notes</h3>
  <div class="form-group">
    <select id="strew" bind:value={selectedStrew}>
      {#each strewOptions as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <select id="indow" bind:value={selectedIndow}>
      {#each indowOptions as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="opticalCtaraderRecognittion" bind:checked={opticalCtaraderRecognittionChecked} />
    <label for="opticalCtaraderRecognittion">Optical Ctarader Recognittion</label>
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="audeMues" bind:checked={audeMuesChecked} />
    <label for="audeMues">Aude Mues</label>
  </div>

  <div class="form-group">
    <input type="text" id="videon" bind:value={videonValue} placeholder="Videon" />
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