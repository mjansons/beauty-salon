<script lang="ts" setup>
import { ref, computed } from 'vue'

const prefix = ref('+371')
const number = ref('')
const name = ref('')
const surname = ref('')
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)

const emit = defineEmits(['nextStep', 'userDetails', 'previousStep'])

const emitPreviousStep = () => {
  emit('previousStep')
}
const emitDetails = async () => {
  emit('nextStep')
  emit('userDetails', {
    phoneNumber: completePhoneNumber.value,
    firstName: name.value,
    lastName: surname.value,
    isOnboarded: true,
  })
}
</script>

<template>
  <div class="background">
    <div class="modal-wrapper">
      <div class="back-button-wrapper">
        <div class="back-button" @click="emitPreviousStep">
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
              fill="#6C38FF"
            />
          </svg>

          <p>Back</p>
        </div>
      </div>
      <h1>Tell us about yourself</h1>
      <p class="disclaimer">
        By signing up you agree to Winks’ Privacy Policy & Terms of Service
      </p>

      <form @submit.prevent="emitDetails">
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
          name="surname"
          id="surname"
          required
          minlength="2"
          maxlength="64"
          v-model="surname"
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
        <div class="button-wrapper">
          <button
            type="submit"
            :disabled="
              name.length < 1 || surname.length < 1 || number.length < 1
            "
            class="btn-primary"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: Calistoga, sans-serif;
  margin-bottom: 16px;
}
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray);
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
}

.modal-wrapper {
  margin: auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  margin-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: auto;
}

.disclaimer {
  font-size: var(--small);
  color: var(--gray-500);
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;
  text-align: left;
}

input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 24px;
}

label {
  margin-bottom: 16px;
}

.phone-number-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  & input {
    margin-bottom: 0px;
    flex: 3;
    min-width: 130px;
  }
}

.phone-number-container select {
  flex: 1;
}
</style>
