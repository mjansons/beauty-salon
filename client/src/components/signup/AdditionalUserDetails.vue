<script lang="ts" setup>
import { ref, computed } from 'vue'

const prefix = ref('+371')
const number = ref('')
const name = ref('')
const surname = ref('')
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)

const emit = defineEmits(['nextStep', 'userDetails'])

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
  <h1>Tell us about yourself</h1>

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
      name="name"
      id="suraname"
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
    <button
      type="submit"
      :disabled="name.length < 1 || surname.length < 1 || number.length < 1"
    >
      Continue
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
