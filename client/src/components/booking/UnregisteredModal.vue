<script lang="ts" setup>
import { ref, computed } from 'vue'
import { trpc } from '@/trpc'

const emit = defineEmits(['isUnregisteredModalOn'])
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

const prefix = ref('+371')
const number = ref('')
const name = ref('')
const surname = ref('')
const comment = ref('')
const email = ref('')
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)
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
    await trpc.appointments.addPublicAppointment.mutate({
      specialistId: props.signupForm.specialistId,
      businessId: props.signupForm.businessId,
      businessSpecialityId: props.signupForm.businessSpecialityId,
      appointmentStartTime: props.signupForm.appointmentStartTime,
      appointmentEndTime: props.signupForm.appointmentEndTime,
      firstName: name.value.trim().toLocaleLowerCase(),
      lastName: surname.value.trim().toLocaleLowerCase(),
      email: email.value,
      phoneNumber: completePhoneNumber.value,
      comment: comment.value,
    })
  } catch (error) {
    console.log('error', error)
  }

  currentStep.value++
}

const exitModal = () => {
  emit('isUnregisteredModalOn', false)
}
</script>

<template>
  <div class="modal-backdrop"></div>
  <div class="modal-wrapper">
    <div class="additional-details" v-if="currentStep === 1">
      <button @click="exitModal">x</button>
      <h1>Your Contact Details</h1>
      <form @submit.prevent="currentStep++">
        <label for="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          minlength="3"
          maxlength="64"
          v-model="name"
        />
        <label for="surname">Surname</label>
        <input
          type="text"
          name="name"
          id="suraname"
          required
          minlength="2"
          maxlength="64"
          v-model="surname"
        />
        <label for="email">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          required
          autocomplete="email"
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
        <label for="comment">Comment</label>
        <input
          type="text"
          name="comment"
          id="comment"
          maxlength="500"
          v-model="comment"
        />
        <button
          type="submit"
          :disabled="
            name.length < 1 ||
            surname.length < 1 ||
            number.length < 1 ||
            email.length < 1
          "
          @click="currentStep++"
        >
          Continue
        </button>
      </form>
    </div>
    <div class="summary" v-if="currentStep === 2">
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
      <button @click="currentStep--">Back</button>
      <button @click="submitAppointment">Submit</button>
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
  background: rgb(0 0 0 / 50%);
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
