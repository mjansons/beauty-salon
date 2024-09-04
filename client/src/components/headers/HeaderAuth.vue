<script setup lang="ts"></script>

<template>
  <header>
    <RouterLink :to="{ name: 'home' }" tabindex="-1">
      <img class="logo" alt="wink logo" src="../../assets/images/wink.svg" />
    </RouterLink>
    <div class="nav-container">
      <div class="category-container">
        <div class="category">Hair</div>
        <div class="category">Nails</div>
        <div class="category">Makeup</div>
      </div>
      <div class="auth-container">
        <button type="button">Profile Settings</button>
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
