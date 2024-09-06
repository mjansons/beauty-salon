<script lang="ts" setup>
import { ref, computed } from 'vue'

const prefix = ref('+371')
const number = ref('')
const completePhoneNumber = computed(() => `${prefix.value}${number.value}`)

</script>

<template>
  <h1>Personal Details</h1>

  <label for="name">Name</label>
  <input type="text" name="name" id="name" />

  <label for="surname">Surname</label>
  <input type="text" name="name" id="suraname" />

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
      pattern="[0-9]*"
      title="Phone number must be numeric"
    />
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
</style>
