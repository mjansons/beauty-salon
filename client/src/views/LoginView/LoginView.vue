<script lang="ts" setup>
import { ref } from 'vue'
import { login } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

// Reactive variables to store error messages
const errorMessage = ref<string | null>(null)

const isSubmitting = ref(false)

async function submitLogin() {
  try {
    isSubmitting.value = true
    await login({ email: email.value, password: password.value })
    errorMessage.value = null

    isSubmitting.value = false
    router.push({ name: 'dashboard' })
  } catch (error) {
    isSubmitting.value = false
    errorMessage.value = 'Email or password incorrect.'
  }
}
</script>

<template>
  <div class="background">
    <div class="login-wrapper">
      <div class="back-button-wrapper">
        <RouterLink
          :to="{ name: 'home' }"
          tabindex="-1"
        >
          <div class="back-button">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#3604C4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.6536 16.4928C11.3814 16.8051 10.9076 16.8375 10.5954 16.5653L6.00715 12.5653C5.84377 12.4229 5.75 12.2167 5.75 12C5.75 11.7832 5.84377 11.5771 6.00715 11.4347L10.5954 7.43466C10.9076 7.16247 11.3814 7.19491 11.6536 7.50714C11.9258 7.81936 11.8933 8.29312 11.5811 8.56532L8.50161 11.25L17.5 11.25C17.9142 11.25 18.25 11.5858 18.25 12C18.25 12.4142 17.9142 12.75 17.5 12.75L8.50161 12.75L11.5811 15.4347C11.8933 15.7069 11.9258 16.1806 11.6536 16.4928Z"
                fill="#3604C4"
              />
            </svg>
            <p>Return</p>
          </div>
        </RouterLink>
      </div>

      <h1>Log in</h1>


      <form @submit.prevent="submitLogin">
        <label for="email">Email Address</label>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
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
        <div class="button-wrapper">
        <button
          type="submit"
          class="btn-primary"
          :disabled="password.length < 1 || email.length < 1 || isSubmitting"
        >
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray);
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
}

.login-wrapper {
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  width: 300px;
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

h1 {
  margin-top: 16px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
}

.button-wrapper {
  width: 100%;
}

.btn-primary {
  width: 100%;
}
</style>
