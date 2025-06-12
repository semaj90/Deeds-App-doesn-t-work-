<script lang="ts">
  // Sidebar navigation logic will go here
  // For now, a simple list of items
  const navItems = [
    { name: 'Cases', icon: '🗂️', href: '/' },
    { name: 'Criminals', icon: '🧑‍⚖️', href: '/criminals' },
    { name: 'Statutes', icon: '⚖️', href: '/statutes/manage' },
    { name: 'Crimes', icon: '🔪', href: '/crimes/manage' },
    // { name: 'New Case', icon: '➕', href: '/new-case' }, // Removed as it's now a modal
    { name: 'New Criminal', icon: '➕', href: '/criminals/new' },
    { name: 'New Statute', icon: '➕', href: '/statutes/manage/new' },
    { name: 'New Crime', icon: '➕', href: '/crimes/manage/new' },
    { name: 'Login', icon: '🔑', href: '/login' },
    { name: 'Signup', icon: '📝', href: '/signup' },
  ];

  let activeItem = 'Cases'; // Default active item
</script>

<aside class="d-flex flex-column flex-shrink-0 p-3 bg-light vh-100" style="width: 280px;">
  <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
    <span class="fs-4 text-primary">WardenNet</span> <span class="example-text">("Harvard Law")</span>
  </a>
  <hr>
  <ul class="nav nav-pills flex-column mb-auto">
    {#each navItems as item}
      <li class="nav-item mb-2">
        <a href={item.href} class="nav-link link-dark d-flex align-items-center {item.name === activeItem ? 'active bg-primary text-white' : ''}" aria-current="{item.name === activeItem ? 'page' : undefined}">
          <span class="me-2">{item.icon}</span>
          {item.name}
        </a>
      </li>
    {/each}
  </ul>
</aside>

<style>
  /* No custom styles needed for Bootstrap 5 layout */
  .example-text {
    font-size: 0.75em; /* Adjust as needed for smaller font */
    color: #6c757d; /* A subtle color for example text */
  }
</style>