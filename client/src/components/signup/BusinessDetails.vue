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

const emit = defineEmits(['nextStep', 'businessDetails'])

const emitDetails = async () => {
  emit('businessDetails', businessDetails.value)
  emit('nextStep')
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
  <h2>{{ props.defaultBusinessDetails ? props.defaultBusinessDetails.name : "Tell us about your Business"}}</h2>

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

    <button
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
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
</style>
