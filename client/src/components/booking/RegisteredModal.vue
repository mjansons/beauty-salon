<script lang="ts" setup>
import { ref, computed } from 'vue'
import { trpc } from '@/trpc'

const emit = defineEmits(['isRegisteredModalOn'])
const props = defineProps<{
  signupForm: {
    businessName: string
    address: string
    city: string
    specialistFirstName: string
    specialistLastName: string
    price: number
    specialityName: string
    clientId: number | null
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    businessId: number
    businessSpecialityId: number
    specialistId: number
    appointmentStartTime: Date
    appointmentEndTime: Date
    comment?: string
  }
}>()

const comment = ref(undefined)
const currentStep = ref(1)

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

const capitalizeFirstLetter = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

const submitAppointment = async () => {
  try {
    await trpc.appointments.addRegisteredUserAppointment.mutate({
      specialistId: props.signupForm.specialistId,
      appointmentStartTime: props.signupForm.appointmentStartTime,
      appointmentEndTime: props.signupForm.appointmentEndTime,
      businessId: props.signupForm.businessId,
      businessSpecialityId: props.signupForm.businessSpecialityId,
      comment: comment.value,
    })
  } catch (error) {
    console.log('error', error)
  }

  currentStep.value++
}

const exitModal = () => {
  emit('isRegisteredModalOn', false)
}
</script>

<template>
  <div class="modal-backdrop"></div>
  <div class="modal-wrapper">
    <div class="summary" v-if="currentStep === 1">
      <button @click="exitModal">x</button>
      <h1>Appointment Summary</h1>
      <p>
        Service: {{ capitalizeFirstLetter(props.signupForm.specialityName) }}
      </p>
      <p>Price: {{ props.signupForm.price }} EUR</p>
      <p>
        Specialist:
        {{ capitalizeFirstLetter(props.signupForm.specialistFirstName) }}
        {{ capitalizeFirstLetter(props.signupForm.specialistLastName) }}
      </p>
      <p>
        Location: {{ capitalizeFirstLetter(props.signupForm.address) }},
        {{ capitalizeFirstLetter(props.signupForm.city) }}
      </p>
      <p>
        Appointment Start:
        {{ formatDateTime(props.signupForm.appointmentStartTime) }}
      </p>
      <button type="button" @click="currentStep++">Continue</button>
    </div>
    <div class="additional-details" v-if="currentStep === 2">
      <button @click="exitModal">x</button>
      <h1>Additional Details</h1>
      <label for="comment">Comment</label>
      <input
        type="text"
        name="comment"
        id="comment"
        maxlength="500"
        v-model="comment"
      />

      <button type="button" @click="currentStep--">Back</button>
      <button type="button" @click="submitAppointment">Submit</button>
    </div>
    <div class="success" v-if="currentStep === 3">
      <p>Success!</p>
      <button @click="exitModal">Return</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.modal-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 16px;
  z-index: 11;
  max-width: 90%;
  width: 400px;
}
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
</style>
