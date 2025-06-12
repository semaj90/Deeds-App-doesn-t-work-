<h2>Login</h2>

<!--
  The form's `action` now points directly to the endpoint that
  Auth.js automatically creates for the credentials provider.
-->
<form action="/auth/signin/credentials" method="POST">
	<div class="mb-3">
		<label for="email" class="form-label">Email</label>
		<!--
      The `name` attribute ("email", "password") is important,
      as Auth.js uses these to find the credentials.
    -->
		<input name="email" id="email" type="email" class="form-control" required placeholder="your@email.com" />
	</div>
	<div class="mb-3">
		<label for="password" class="form-label">Password</label>
		<input name="password" id="password" type="password" class="form-control" required />
	</div>
	<button type="submit" class="btn btn-primary">Sign In</button>
</form>