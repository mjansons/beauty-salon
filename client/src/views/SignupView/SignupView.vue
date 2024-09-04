<script lang="ts" setup>
import { signup } from '@/stores/user'
import { ref } from 'vue'

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
})

const hasSucceeded = ref(false)

async function submitSignup() {
  try {
    await signup(userForm.value)
    hasSucceeded.value = true
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <h1>tryin to sign up</h1>

  <form @submit.prevent="submitSignup">
    <label for="first-name">First name</label>
    <input
      type="text"
      name="firstName"
      id="first-name"
      v-model="userForm.firstName"
    />

    <label for="last-name">Last name</label>
    <input
      type="text"
      name="lastName"
      id="last-name"
      v-model="userForm.lastName"
    />

    <label for="email">Email</label>
    <input type="email" name="email" id="email" v-model="userForm.email" />

    <label for="phone-number">Phone number</label>
    <input
      type="tel"
      name="phoneNumber"
      id="phone-number"
      v-model="userForm.phoneNumber"
    />

    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      id="password"
      v-model="userForm.password"
    />

    <label for="repeat-password">Repeat password</label>
    <input type="password" name="RepeatedPassword" id="repeat-password" />

    <button type="submit">Sign Up</button>
  </form>


  <div>{{ userForm }}</div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}

</style>
