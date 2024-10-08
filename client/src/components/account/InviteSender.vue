<script lang="ts" setup>
import { ref } from 'vue'
import InfoToast from './InfoToast.vue'
import { TRPCClientError } from '@trpc/client'
import { inviteEmployee } from '@/stores/trpcCalls'

const props = defineProps<{
  businessId: number
}>()

const email = ref('')
const showToast = ref(false)
const userEmailErrorMessage = ref<string | null>(null)

function handleSignupError(error: any) {
  if (error instanceof TRPCClientError) {
    const message = error.message.toLowerCase()
    if (message.includes('not found')) {
      userEmailErrorMessage.value = `Specialist with the provided email not found.`
    } else if (message.includes('exists')) {
      userEmailErrorMessage.value = `Invitation already extended to this specialist.`
    } else {
      userEmailErrorMessage.value = `An unknown error occurred.`
    }
  }
}

const sendInvite = async () => {
  try {
    await inviteEmployee({
      businessId: props.businessId,
      employeeEmail: email.value,
    })

    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 1500)
    userEmailErrorMessage.value = null
  } catch (error) {
    handleSignupError(error)
  }
}
</script>

<template>
  <InfoToast :showToast="showToast" :buttonText="'Invitation sent!'" />
  <form @submit.prevent="sendInvite">
    <p v-if="userEmailErrorMessage">{{ userEmailErrorMessage }}</p>
    <label for="email">Add Employee</label>
    <input type="email" name="email" id="email" v-model="email" />
    <button type="submit">Send invite</button>
  </form>
</template>

<!-- <style scoped>
</style> -->
