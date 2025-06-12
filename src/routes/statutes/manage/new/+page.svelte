<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    let name = '';
    let description = '';
    let sectionNumber = '';

    async function handleSubmit() {
        const response = await fetch('/api/statutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, sectionNumber })
        });

        if (response.ok) {
            alert('Statute created successfully!');
            goto('/statutes/manage');
        } else {
            const errorData = await response.json();
            alert(`Failed to create statute: ${errorData.message || response.statusText}`);
        }
    }
</script>

<svelte:head>
    <title>WardenNet - New Statute</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</svelte:head>

<div class="container mt-4 text-dark">
    <h1 class="mb-4 text-center text-primary">Add New Statute</h1>
    <form on:submit|preventDefault={handleSubmit} use:enhance>
        <div class="mb-3">
            <label for="name" class="form-label">Statute Name</label>
            <input type="text" class="form-control" id="name" name="name" bind:value={name} required />
        </div>

        <div class="mb-3">
            <label for="sectionNumber" class="form-label">Section Number</label>
            <input type="text" class="form-control" id="sectionNumber" name="sectionNumber" bind:value={sectionNumber} required />
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Description (Optional)</label>
            <textarea class="form-control" id="description" name="description" bind:value={description} rows="5"></textarea>
        </div>

        <button type="submit" class="btn btn-primary w-100">Add Statute</button>
    </form>
</div>