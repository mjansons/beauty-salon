<script lang="ts" setup>
import { ref } from 'vue'
import { login } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

// Reactive variables to store error messages
const errorMessage = ref<string | null>(null)

async function submitLogin() {
  try {
    await login({ email: email.value, password: password.value })
    errorMessage.value = null

    router.push({ name: 'dashboard' })
  } catch (error) {
    errorMessage.value = 'Email or password incorrect.'
  }
}
</script>

<template>
  <RouterLink :to="{ name: 'home' }" tabindex="-1">
    <button type="button">Return</button>
  </RouterLink>

  <h1>Log in</h1>
  <p v-if="errorMessage">{{ errorMessage }}</p>

  <form @submit.prevent="submitLogin">
    <label for="email">Email Address</label>
    <input
      type="email"
      name="email"
      id="email"
      v-model="email"
      required
      autocomplete="email"
    />

    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      id="password"
      v-model="password"
      required
      minlength="8"
      maxlength="64"
      autocomplete="current-password"
    />

    <button type="submit" :disabled="password.length < 1 || email.length < 1">
      Create Account
    </button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
</style>
