<!-- UnregisteredModal.vue -->
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
const isSubmitting = ref(false)

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
  isSubmitting.value = true
  try {
    await trpc.appointments.addPublicAppointment.mutate({
      specialistId: props.signupForm.specialistId,
      businessId: props.signupForm.businessId,
      businessSpecialityId: props.signupForm.businessSpecialityId,
      appointmentStartTime: props.signupForm.appointmentStartTime,
      appointmentEndTime: props.signupForm.appointmentEndTime,
      firstName: name.value.trim().toLowerCase(),
      lastName: surname.value.trim().toLowerCase(),
      email: email.value,
      phoneNumber: completePhoneNumber.value,
      comment: comment.value,
    })
    currentStep.value++
  } catch (error) {
    console.error('Error submitting appointment:', error)
    // Handle error (e.g., display a message to the user)
  } finally {
    isSubmitting.value = false
  }
}

const exitModal = () => {
  emit('isUnregisteredModalOn', false)
}
</script>

<template>
  <div class="modal-backdrop"></div>
  <div class="modal-wrapper">
    <!-- Step 1: Contact Details -->
    <div v-if="currentStep === 1">
      <div class="back-button-wrapper">
        <div class="back-button">
          <img
            src="../../assets/images/arrows/arrow-back.svg"
            alt="back"
            @click="exitModal"
          />
          <p>Return</p>
        </div>
      </div>
      <h1>Your Contact Details</h1>
      <form @submit.prevent="currentStep++">
        <label for="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          minlength="1"
          maxlength="64"
          v-model="name"
        />
        <label for="surname">Surname</label>
        <input
          type="text"
          name="surname"
          id="surname"
          required
          minlength="1"
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
        <div class="continue-button-wrapper">
          <button
            type="submit"
            :disabled="
              isSubmitting ||
              name.length < 1 ||
              surname.length < 1 ||
              number.length < 1 ||
              email.length < 1
            "
            class="btn-primary"
          >
            Continue
          </button>
        </div>
      </form>
    </div>

    <!-- Step 2: Appointment Summary -->
    <div v-if="currentStep === 2">
      <div class="back-button-wrapper">
        <div class="back-button" @click="currentStep--">
          <img src="../../assets/images/arrows/arrow-back.svg" alt="back" />
          <p>Back</p>
        </div>
      </div>
      <h1>Appointment Summary</h1>
      <div class="summary-item">
        <h4>Service:</h4>
        <p>{{ capitalizeFirstLetter(props.signupForm.specialityName) }}</p>
      </div>
      <div class="summary-item">
        <h4>Price:</h4>
        <p>{{ props.signupForm.price }} EUR</p>
      </div>

      <div class="summary-item">
        <h4>Specialist:</h4>
        <p>
          {{ capitalizeFirstLetter(props.signupForm.specialistFirstName) }}
          {{ capitalizeFirstLetter(props.signupForm.specialistLastName) }}
        </p>
      </div>

      <div class="summary-item">
        <h4>Location:</h4>
        <p>
          {{ capitalizeFirstLetter(props.signupForm.address) }},
          {{ capitalizeFirstLetter(props.signupForm.city) }}
        </p>
      </div>

      <div class="summary-item">
        <h4>Appointment Start:</h4>
        <p>{{ formatDateTime(props.signupForm.appointmentStartTime) }}</p>
      </div>

      <form @submit.prevent="submitAppointment">
        <div class="continue-button-wrapper">
          <button type="submit" :disabled="isSubmitting" class="btn-primary">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Step 3: Success Message -->
    <div v-if="currentStep === 3">
      <p>Success! Your appointment has been booked.</p>
      <div class="return-button-wrapper"><button @click="exitModal" class="btn-primary">Return</button></div>
    </div>
  </div>
</template>

<style scoped>
.summary-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  margin: 16px 0;

  & h4 {
    white-space: nowrap;
    margin: 0;
  }
}
.btn-primary {
  flex: 1 1 0;
}
h1 {
  font-family: Calistoga, sans-serif;
  font-size: var(--extra-large);
  margin: 32px 0 0 0;
}

select {
  min-width: 120px;
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.return-button-wrapper{
  display: flex;
  justify-content: center;
}

.continue-button-wrapper {
  display: flex;
  justify-content: flex-end;

  & .btn-primary {
    max-width: 150px;
  }
}

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
  padding: 32px;
  z-index: 11;
  max-width: 90%;
  border-radius: 16px;
}

.modal-wrapper button {
  margin-top: 16px;
}

.phone-number-container {
  display: flex;
  align-items: center;
}

.phone-number-container select {
  margin-right: 8px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

form label {
  margin-top: 8px;
}

form input,
form select {
  margin-bottom: 8px;
  padding: 8px;
  font-size: 16px;
}

form button {
  margin-top: 16px;
}

@media only screen and (width <= 500px) {
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
    padding: 32px;
    z-index: 11;
    max-width: 100%;
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }

  .phone-number-container {
    flex-direction: column;
    align-items: stretch;
  }

  .phone-number-container select,
  .phone-number-container input {
    box-sizing: border-box;
    width: 100%;
    margin-right: 0;
  }

  select {
    min-width: unset;
  }
}
</style>
