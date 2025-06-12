<script lang="ts">
    import { session } from '$lib/auth/userStore';
    import { goto } from '$app/navigation';

    $: if (!$session?.user) {
        goto('/login');
    }

    let files: FileList;
    let uploadMessage = '';
    let uploadError = '';

    async function handleFileUpload() {
        uploadMessage = '';
        uploadError = '';

        if (!files || files.length === 0) {
            uploadError = 'Please select files to upload.';
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                uploadMessage = 'Files uploaded successfully!';
                // Optionally, clear the file input
                const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            } else {
                const errorData = await response.json();
                uploadError = errorData.message || 'File upload failed.';
            }
        } catch (error: any) {
            uploadError = error.message || 'An unexpected error occurred during upload.';
        }
    }
</script>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header text-center">
                    <h3>Dashboard</h3>
                </div>
                <div class="card-body">
                    {#if $session?.user}
                        <p>Welcome, {$session.user.name}!</p>
                        <p>Your email: {$session.user.email}</p>

                        <h4 class="mt-4">File Upload</h4>
                        {#if uploadMessage}
                            <div class="alert alert-success" role="alert">
                                {uploadMessage}
                            </div>
                        {/if}
                        {#if uploadError}
                            <div class="alert alert-danger" role="alert">
                                {uploadError}
                            </div>
                        {/if}
                        <form on:submit|preventDefault={handleFileUpload}>
                            <div class="mb-3">
                                <label for="fileInput" class="form-label">Select files:</label>
                                <input
                                    type="file"
                                    class="form-control"
                                    id="fileInput"
                                    multiple
                                    bind:files
                                />
                            </div>
                            <button type="submit" class="btn btn-success">Upload Files</button>
                        </form>
                    {:else}
                        <p>You are not logged in. Please <a href="/login">login</a>.</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>