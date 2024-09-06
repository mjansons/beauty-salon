<script lang="ts" setup>
import { ref, computed } from 'vue'
import { signup } from '@/stores/user'
import { TRPCClientError } from '@trpc/client'
import { login } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    await signup(userForm.value)
    await login({email:userForm.value.email, password: userForm.value.password})
    errorMessage.value = null
    userEmailErrorMessage.value = null

    router.push({ name: 'onboarding' })
  } catch (error) {
    handleSignupError(error)
  }
}
</script>

<template>
  <RouterLink :to="{ name: 'home' }" tabindex="-1">
    <button type="button">Return</button>
  </RouterLink>

  <h1>Create an account</h1>
  <p v-if="errorMessage">An unknown error occurred while signing up</p>

  <form @submit.prevent="submitSignup">

    <label for="email">Email Address</label>
    <p v-if="userEmailErrorMessage">{{ userEmailErrorMessage }}</p>
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
    <p v-if="!paswordsMatch">Passwords are not matching</p>
    <input
      v-model="repeatedPassword"
      type="password"
      name="RepeatedPassword"
      id="repeat-password"
      autocomplete="new-password"
      required
    />

    <RouterLink :to="{ name: 'login' }" tabindex="-1">
      <button type="button">Log in to existing account</button>
    </RouterLink>

    <button
      type="submit"
      :disabled="
        !paswordsMatch ||
        userForm.password.length < 1 ||
        userForm.email.length < 1
      "
    >
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
