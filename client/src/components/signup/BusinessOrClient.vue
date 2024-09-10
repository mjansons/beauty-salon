<script lang="ts" setup>
import { ref } from 'vue'

const isClientAccount = ref(true)
const emit = defineEmits(['isClientAccount', 'nextStep'])

const emitValues = () => {
  emit('isClientAccount', isClientAccount.value)
  emit('nextStep')
}
</script>

<template>
  <h1>What will you use wink for?</h1>
  <div class="client-business-container">
    <div
      class="client"
      :class="{ selected: isClientAccount }"
      @click="isClientAccount = true"
    >
      <p>Book appointments</p>
    </div>
    <div
      class="business"
      :class="{ selected: !isClientAccount }"
      @click="isClientAccount = false"
    >
      <p>Work or manage my business</p>
    </div>
  </div>

  <button type="button" @click="emitValues">Continue</button>
</template>

<style scoped>
.client-business-container {
  display: flex;

  & .client {
    border: 1px solid transparent;
    padding: 24px;
  }

  & .business {
    border: 1px solid transparent;
    padding: 24px;
  }

  div.selected {
    border-color: rgb(144, 53, 183);
  }
}
</style>
