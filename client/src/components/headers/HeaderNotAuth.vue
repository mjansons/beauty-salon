<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink :to="{ name: 'home' }" tabindex="-1">
      <img class="logo" alt="wink logo" src="../../assets/images/wink.svg" />
    </RouterLink>
    <div class="nav-container">
      <div class="auth-container">
        <RouterLink :to="{ name: 'signup' }" tabindex="-1">
          <button type="button" class="btn-secondary">Sign up</button></RouterLink
        >
        <RouterLink :to="{ name: 'login' }" tabindex="-1">
          <button type="button" class="btn-primary">Log in</button>
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

@media only screen and (width <= 400px) {
  .logo{
    display: none;
  }

  header{
    justify-content: center;
  }
}
</style>
