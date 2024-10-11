<!-- RegisteredModal.vue -->
<script lang="ts" setup>
import { ref } from 'vue';
import { trpc } from '@/trpc';

const emit = defineEmits(['isRegisteredModalOn']);
const props = defineProps<{
  signupForm: {
    businessName: string;
    address: string;
    city: string;
    specialistFirstName: string;
    specialistLastName: string;
    price: number;
    specialityName: string;
    clientId: number | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessId: number;
    businessSpecialityId: number;
    specialistId: number;
    appointmentStartTime: Date;
    appointmentEndTime: Date;
    comment?: string;
  };
}>();

const comment = ref('');
const currentStep = ref(1);
const isSubmitting = ref(false);

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

const capitalizeFirstLetter = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const submitAppointment = async () => {
  isSubmitting.value = true;
  try {
    await trpc.appointments.addRegisteredUserAppointment.mutate({
      specialistId: props.signupForm.specialistId,
      appointmentStartTime: props.signupForm.appointmentStartTime,
      appointmentEndTime: props.signupForm.appointmentEndTime,
      businessId: props.signupForm.businessId,
      businessSpecialityId: props.signupForm.businessSpecialityId,
      comment: comment.value,
    });
    currentStep.value++;
  } catch (error) {
    console.error('Error submitting appointment:', error);
    // Handle error (e.g., display a message to the user)
  } finally {
    isSubmitting.value = false;
  }
};

const exitModal = () => {
  emit('isRegisteredModalOn', false);
};
</script>

<template>
  <div class="modal-backdrop"></div>
  <div class="modal-wrapper">
    <!-- Step 1: Appointment Summary -->
    <div v-if="currentStep === 1">
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

    <!-- Step 2: Additional Details -->
    <div v-if="currentStep === 2">
      <button @click="exitModal">x</button>
      <h1>Additional Details</h1>
      <form @submit.prevent="submitAppointment">
        <label for="comment">Comment</label>
        <input
          type="text"
          name="comment"
          id="comment"
          maxlength="500"
          v-model="comment"
        />
        <div class="button-group">
          <button type="button" @click="currentStep--">Back</button>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Step 3: Success Message -->
    <div v-if="currentStep === 3">
      <p>Success! Your appointment has been booked.</p>
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
  padding: 24px;
  z-index: 11;
  max-width: 90%;
  width: 400px;
}

.modal-wrapper button {
  margin-top: 16px;
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

form input {
  margin-bottom: 8px;
  padding: 8px;
  font-size: 16px;
}

form button {
  margin-top: 16px;
}
</style>
