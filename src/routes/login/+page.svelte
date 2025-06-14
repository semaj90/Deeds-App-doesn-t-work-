<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>Login to WardenNet</h1>
    
    {#if form?.error}
      <div class="alert alert-danger">{form.error}</div>
    {/if}
    {#if form?.message}
      <div class="alert alert-success">{form.message}</div>
    {/if}
    {#if form?.success}
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success!</strong> Logged in.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    {/if}

    <form method="POST" action="/api/auth/signin/credentials?callbackUrl=/dashboard">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          class="form-control" 
          required 
          placeholder="your@email.com" 
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          class="form-control" 
          required 
        />
      </div>

      <button type="submit" class="btn-primary">Sign In</button>
    </form>

    <div class="auth-footer">
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  .auth-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 0.25rem;
  }

  .btn-primary {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .auth-footer {
    margin-top: 1.5rem;
    text-align: center;
  }

  .alert {
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
  }

  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
</style>