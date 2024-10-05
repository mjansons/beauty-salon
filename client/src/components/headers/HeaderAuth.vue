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
          <p>Appointments</p>
        </RouterLink>
        <RouterLink :to="{ name: 'account' }" tabindex="-1">
          <button type="button">Account</button>
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

button {
  height: 40px;
  padding: 8px 20px;
  white-space: nowrap;
}
</style>
