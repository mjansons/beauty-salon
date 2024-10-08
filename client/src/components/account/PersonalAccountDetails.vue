<script lang="ts" setup>
import OwnerAccountDetails from './OwnerAccountDetails.vue'
import InfoToast from './InfoToast.vue'
import { ref, computed, onBeforeMount } from 'vue'
import { TRPCClientError } from '@trpc/client'
import { getUserDetails, updateUserDetails } from '@/stores/trpcCalls'

const showToast = ref(false)

// phone number
const prefix = ref('+371')
const number = ref('')
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
})

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

async function updateDetails() {
  try {
    await updateUserDetails({
      ...userForm.value,
      phoneNumber: completePhoneNumber.value,
    })
    showToast.value = true
    errorMessage.value = null
    userEmailErrorMessage.value = null
    setTimeout(() => {
      showToast.value = false
    }, 1500)
  } catch (error) {
    handleSignupError(error)
  }
}

onBeforeMount(async () => {
  const details = await getUserDetails()
  if (details) {
    userForm.value.firstName = details.firstName
    userForm.value.lastName = details.lastName
    userForm.value.email = details.email

    prefix.value = details.phoneNumber.slice(0, 4)
    number.value = details.phoneNumber.slice(4)
  }
})
</script>

<template>
  <InfoToast :showToast="showToast" />
  <h1>Personal details</h1>
  <form @submit.prevent="updateDetails">
    <label for="name">Name</label>
    <input
      type="text"
      name="name"
      id="name"
      required
      minlength="3"
      maxlength="64"
      v-model="userForm.firstName"
    />
    <label for="surname">Surname</label>
    <input
      type="text"
      name="name"
      id="suraname"
      required
      minlength="2"
      maxlength="64"
      v-model="userForm.lastName"
    />

    <label for="email">Email</label>
    <input
      type="email"
      name="email"
      id="email"
      required
      minlength="3"
      maxlength="64"
      v-model="userForm.email"
    />
    <label for="phone-number">Phone number</label>
    <div class="phone-number-container">
      <select name="prefix" v-model="prefix">
        <option value="+370">🇱🇹 +370</option>
        <option value="+371">🇱🇻 +371</option>
        <option value="+372">🇪🇪 +372</option>
      </select>
      <input
        type="tel"
        name="phoneNumber"
        id="phone-number"
        v-model="number"
        maxlength="8"
        minlength="8"
        pattern="[0-9]*"
        title="Phone number must be numeric"
        required
      />
    </div>
    <button
      type="submit"
      :disabled="
        userForm.firstName.length < 1 ||
        userForm.lastName.length < 1 ||
        number.length < 1 ||
        userForm.email.length < 1
      "
    >
      Save changes
    </button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  justify-content: center;
}

.phone-number-container {
  display: flex;

  & input {
    width: 100%;
  }
}
</style>
