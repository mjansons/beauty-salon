<script lang="ts" setup>
import { ref, computed } from 'vue'
import { login, signup } from '@/stores/user'
import { TRPCClientError } from '@trpc/client'
import { useRouter } from 'vue-router'

const router = useRouter()

const isSubmitting = ref(false)

// phone number
const prefix = ref('+371')
const number = ref('')
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: completePhoneNumber.value,
})

// password match validation
const repeatedPassword = ref('')
const paswordsMatch = computed(
  () => userForm.value.password === repeatedPassword.value
)

// Reactive variables to store error messages
const errorMessage = ref<string | null>(null)
const userEmailErrorMessage = ref<string | null>(null)

function handleSignupError(error: any) {
  if (error instanceof TRPCClientError) {
    const message = error.message.toLowerCase()
    if (message.includes('exists')) {
      userEmailErrorMessage.value = 'User with this email already exists.'
    } else if (message.includes('email')) {
      userEmailErrorMessage.value = 'Please provide a valid email address'
    } else {
      errorMessage.value = 'An unknown error occurred.'
    }
  } else {
    errorMessage.value = 'An unknown error occurred.'
  }
}

async function submitSignup() {
  try {
    isSubmitting.value = true
    await signup(userForm.value)
    await login({
      email: userForm.value.email,
      password: userForm.value.password,
    })
    errorMessage.value = null
    userEmailErrorMessage.value = null

    isSubmitting.value = false

    router.push({ name: 'onboarding' })
  } catch (error) {
    isSubmitting.value = false
    handleSignupError(error)
  }
}
</script>

<template>
  <div class="background">
    <div class="signup-wrapper">
      <RouterLink
        class="back-button-wrapper"
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

      <h1>Create an account</h1>
      <form @submit.prevent="submitSignup">
        <label for="email">Email Address</label>
        <p class="error-message" v-if="userEmailErrorMessage">
          {{ userEmailErrorMessage }}
        </p>
        <input
          type="email"
          name="email"
          id="email"
          v-model="userForm.email"
          required
          autocomplete="email"
        />
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="userForm.password"
          required
          minlength="8"
          maxlength="64"
          autocomplete="current-password"
        />
        <label for="repeat-password">Repeat password</label>
        <p class="error-message" v-if="!paswordsMatch">Passwords are not matching.</p>
        <input
          v-model="repeatedPassword"
          type="password"
          name="RepeatedPassword"
          id="repeat-password"
          autocomplete="new-password"
          required
        />
        <div class="button-wrapper">
          <RouterLink :to="{ name: 'login' }" tabindex="-1">
            <span class="login-button">Log in</span>
          </RouterLink>
          <button
            class="btn-primary"
            type="submit"
            :disabled="
              isSubmitting ||
              !paswordsMatch ||
              userForm.password.length < 1 ||
              userForm.email.length < 1
            "
          >
            {{ isSubmitting ? 'Creating...' : 'Create Account' }}
          </button>
        </div>
        <p class="disclaimer">
          By signing up you agree to Winks’ Privacy Policy & Terms of Service
        </p>
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
  width: 100%;
  height: 100vh; /* Full viewport height */
  box-sizing: border-box;
  overflow: auto; /* Enables scrolling if content overflows */
  padding: 16px; /* Adds space around the modal on very small screens */
}

.signup-wrapper {
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  width: 550px;
  box-sizing: border-box;
  max-width: 400px;
}

.disclaimer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  text-align: center;
}

.button-wrapper {
  width: 100%;
}

.login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0 16px 0;
  width: 100%;
  color: var(--purple-700);
}

.login-button:hover {
  text-decoration: underline;
}

.login-button:active {
  opacity: 0.5;
}

.btn-primary {
  width: 100%;
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
}
</style>
