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
    <h3 for="email">Add Employee</h3>
    <div class="invite-wrapper">
      <p class="error-message" v-if="userEmailErrorMessage">{{ userEmailErrorMessage }}</p>
      <input type="email" name="email" id="email" v-model="email" />
      <button type="submit" class="btn-primary">Send invite</button>
    </div>
  </form>
</template>

<style scoped>
h3 {
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: Calistoga, sans-serif;
}
.invite-wrapper {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 16px;
  box-sizing: border-box;
}

form {
  display: flex;
  flex: 1 1 0;
  border: 2px dashed var(--purple-100);
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  max-height: fit-content;
  box-sizing: border-box;
  width: 100%;

  & #email {
    display: flex;
    flex: 1 1 0;
    width: 100%;
    min-width: 100px;
    box-sizing: border-box;
  }
}

.btn-primary {
  white-space: nowrap;
  padding: 8px 12px;
  flex: 0;
  margin-left: auto;
}
</style>
