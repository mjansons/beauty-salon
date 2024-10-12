<script setup lang="ts"></script>

<template>
  <header>
    <RouterLink :to="{ name: 'dashboard' }" tabindex="-1">
      <img class="logo" alt="wink logo" src="../../assets/images/wink.svg" />
    </RouterLink>
    <div class="nav-container">
      <div class="category-container"></div>
      <div class="auth-container">
        <RouterLink :to="{ name: 'appointments' }" tabindex="-1">
          <p class="header-link">Appointments</p>
        </RouterLink>
        <RouterLink :to="{ name: 'account' }" tabindex="-1">
          <button type="button" class="btn-secondary">Account</button>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.auth-container {
  display: flex;
  gap: 16px;
}

.header-link {
  text-decoration: none;
  color: var(--purple-900);
}

.header-link:hover {
  text-decoration: none;
  color: var(--purple-500);
}

.header-link:active {
  text-decoration: none;
  color: var(--purple-300);
}

.header-link:visited {
  text-decoration: none;
  color: var(--purple-900);
}

button {
  height: 40px;
  padding: 8px 20px;
  white-space: nowrap;
}

@media only screen and (width <= 400px) {
  .logo {
    display: none;
  }

  header {
    justify-content: center;
  }
}
</style>
