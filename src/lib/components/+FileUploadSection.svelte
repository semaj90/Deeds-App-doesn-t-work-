<script lang="ts">
  import { onMount } from 'svelte';
  import { UploadDropzone } from '@uploadthing/svelte';
  import type { OurFileRouter } from '$lib/uploadthing'; // Corrected import path

  let selectedFileType: string = 'PDF';
  let spreutChecked: boolean = false;
  let topuitionValue: string = '';

  let opticalCharacterRecognitionChecked: boolean = false;


  const fileTypes = ['PDF', 'DOCX', 'JPG', 'PNG', 'MP4', 'MP3']; // Added video/audio types

  function handleUploadComplete(res: any) {
    console.log('Files:', res);
    uploadedFiles = [...uploadedFiles, ...res.map((file: any) => ({ name: file.name, url: file.url, type: file.type }))];
    alert('Upload Completed');
  }

  function handleUploadError(error: Error) {
    alert(`Upload Error: ${error.message}`);
  }

  // Placeholder for AI auto-labeling on file drop
  async function autoLabelFile(file: File): Promise<string[]> {
    // In a real scenario, this would call an AI service (e.g., Ollama via API)
    // to classify the file (e.g., "video testimony", "witness transcript").
    console.log(`Simulating AI auto-labeling for: ${file.name}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    if (file.type.startsWith('video/')) return ['video-testimony', 'evidence'];
    if (file.type.startsWith('audio/')) return ['audio-recording', 'witness-statement'];
    if (file.type === 'application/pdf') return ['document', 'report'];
    if (file.type === 'text/plain') return ['transcript', 'notes'];
    return ['unclassified'];
  }

  // This function would be called after a successful upload to trigger AI processing
  async function processUploadedFile(fileData: { name: string; url: string; type: string }) {
    console.log(`Processing uploaded file: ${fileData.name}`);
    const labels = await autoLabelFile({ name: fileData.name, type: fileData.type } as File); // Mock File object
    console.log(`AI Labels for ${fileData.name}: ${labels.join(', ')}`);
    // Here you would update the database with the labels and potentially trigger summarization
  }

  // Monitor uploadedFiles for new additions and trigger processing
  $: {
    if (uploadedFiles.length > 0) {
      // Process the last added file (or all new files if multiple were uploaded)
      const newFile = uploadedFiles[uploadedFiles.length - 1];
      processUploadedFile(newFile);
    }
  }
</script>

<div class="section-card">
  <h3>Automatic File Upload</h3>
  <div class="form-group">
    <label for="fileType">File Type for AI Processing</label>
    <select id="fileType" bind:value={selectedFileType}>
      {#each fileTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="spreut" bind:checked={spreutChecked} />
    <label for="spreut">Enable AI Summarization</label>
  </div>

  <div class="form-group">
    <label for="topuition">AI Model Parameters (Optional)</label>
    <input type="text" id="topuition" bind:value={topuitionValue} placeholder="e.g., 'detailed', 'concise'" />
  </div>

  <div class="form-group checkbox-group">
    <input type="checkbox" id="opticalRecognition" bind:checked={opticalCharacterRecognitionChecked} />
    <label for="opticalRecognition">Enable Optical Character Recognition (OCR)</label>
  </div>

  <div class="upload-area">
    <UploadDropzone<FileRouter>
      endpoint="imageUploader"
      onUploadBegin={(fileName) => console.log("upload begin", fileName)}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
    />
  </div>

  {#if uploadedFiles.length > 0}
    <div class="file-previews masonry-grid">
      {#each uploadedFiles as file (file.url)}
        <div class="file-preview-item">
          {#if file.type.startsWith('image/')}
            <img src={file.url} alt={file.name} />
          {:else if file.type === 'application/pdf'}
            <img src="/pdf-icon.png" alt="PDF icon" class="pdf-icon" />
            <p>{file.name}</p>
          {:else if file.type.startsWith('video/')}
            <video controls src={file.url} class="video-preview"></video>
            <p>{file.name}</p>
          {:else if file.type.startsWith('audio/')}
            <audio controls src={file.url} class="audio-preview"></audio>
            <p>{file.name}</p>
          {:else}
            <img src="/file-icon.png" alt="File icon" class="file-icon" />
            <p>{file.name}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
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

  .upload-area {
    margin-top: 20px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    min-height: 150px; /* Ensure visibility */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-previews {
    margin-top: 20px;
  }

  .masonry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 10px;
    grid-auto-rows: 10px; /* Base row height for masonry */
  }

  .file-preview-item {
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px;
    text-align: center;
    break-inside: avoid; /* Prevent items from breaking across columns */
    grid-row-end: span 20; /* Adjust this value based on content height */
  }

  .file-preview-item img,
  .file-preview-item video,
  .file-preview-item audio {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto 10px auto;
    border-radius: 4px;
  }

  .file-preview-item .pdf-icon,
  .file-preview-item .file-icon {
    width: 50px; /* Adjust size as needed */
    height: 50px;
  }

  .file-preview-item p {
    font-size: 0.9rem;
    word-break: break-all;
  }
</style>