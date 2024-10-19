<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  defaultBusinessDetails?: {
    id: number
    name: string
    address: string
    city: string
    postalCode: string
    email: string
    phoneNumber: string
  }
  buttonText?: string
  accountView?: boolean
}>()

const buttonText = computed(() => {
  return props.buttonText ? props.buttonText : 'Continue'
})

const name = ref('')
const address = ref('')
const city = ref('')
const postalCode = ref('')
const email = ref('')
const prefix = ref('+371')
const number = ref('')
const id = ref(0)
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)

const businessDetails = computed(() => ({
  businessId: id.value,
  name: name.value,
  address: address.value,
  city: city.value,
  postalCode: postalCode.value,
  email: email.value,
  phoneNumber: completePhoneNumber.value,
}))

const emit = defineEmits(['nextStep', 'businessDetails', 'previousStep'])

const emitDetails = async () => {
  emit('businessDetails', businessDetails.value)
  emit('nextStep')
}

const emitPreviousStep = () => {
  emit('previousStep')
}
function parsePhoneNumber(phoneNumber: string) {
  const match = phoneNumber.match(/^(\+\d{3})(\d{5,8})$/)
  if (match) {
    prefix.value = match[1]
    number.value = match[2]
  } else {
    // Default values if parsing fails
    prefix.value = '+371'
    number.value = ''
  }
}

watch(
  () => props.defaultBusinessDetails,
  (newVal) => {
    if (newVal) {
      id.value = newVal.id
      name.value = newVal.name
      address.value = newVal.address
      city.value = newVal.city
      postalCode.value = newVal.postalCode
      email.value = newVal.email
      parsePhoneNumber(newVal.phoneNumber)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div :class="{ background: !props.accountView }">
    <div
      :class="
        props.accountView ? 'account-view-modal-wrapper' : 'modal-wrapper'
      "
    >
      <div v-if="!props.accountView" class="back-button-wrapper">
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
              fill="#3604C4"
            />
          </svg>

          <p>Back</p>
        </div>
      </div>
      <h1 v-if="!props.accountView">
        {{
          props.defaultBusinessDetails
            ? props.defaultBusinessDetails.name
            : 'Tell us about your Business'
        }}
      </h1>
      <h3 v-if="props.accountView">Account Details</h3>
      <p class="disclaimer" v-if="!props.accountView">
        By signing up you agree to Winks’ Privacy Policy & Terms of Service
      </p>
      <form @submit.prevent="emitDetails">
        <label for="name">Business name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          minlength="3"
          maxlength="64"
          v-model="name"
        />

        <label for="email">Business email</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          required
          autocomplete="email"
        />

        <label for="phone-number">Business phone number</label>
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

        <label for="city">City</label>
        <select name="city" id="city" required v-model="city">
          <option value="riga">Riga</option>
          <option value="liepaja">Liepaja</option>
          <option value="ventspils">Ventspils</option>
        </select>

        <label for="address">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          required
          minlength="2"
          maxlength="64"
          v-model="address"
        />

        <label for="postal-code">Postal code</label>
        <input
          type="text"
          name="postalCode"
          id="postal-code"
          required
          minlength="5"
          maxlength="8"
          v-model="postalCode"
          title="LV-1234 | EE-12345 | LT-12345"
        />

        <div class="button-wrapper">
          <button
            class="btn-primary"
            type="submit"
            :disabled="
              name.length < 1 ||
              address.length < 1 ||
              number.length < 1 ||
              city.length < 1 ||
              postalCode.length < 1
            "
          >
            {{ buttonText }}
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

h3 {
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: Calistoga, sans-serif;
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

.account-view-modal-wrapper {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  border: 2px dashed var(--purple-100);
  max-width: 400px;
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  margin-top: 32px;
  margin-left: auto;
  white-space: nowrap;
  min-width: 50px;
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
  margin-bottom: 16px;

  & input {
    margin-bottom: 0px;
    flex: 3;
    min-width: 130px;
  }
}

.phone-number-container select {
  flex: 1;
}

#city {
  width: 100%;
  margin-bottom: 24px;
}
</style>
