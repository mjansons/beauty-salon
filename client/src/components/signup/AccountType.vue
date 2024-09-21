<script lang="ts" setup>
import { ref } from 'vue'

const isSpecialistAccount = ref(true)
const emit = defineEmits(['isSpecialistAccount', 'nextStep'])

const emitValues = () => {
  emit('isSpecialistAccount', isSpecialistAccount.value)
  emit('nextStep')
}
</script>

<template>
  <h1>Choose an account type</h1>
  <div class="specialist-business-container">
    <div
      class="specialist"
      :class="{ selected: isSpecialistAccount }"
      @click="isSpecialistAccount = true"
    >
      <p>Specialist</p>
    </div>
    <div
      class="business"
      :class="{ selected: !isSpecialistAccount }"
      @click="isSpecialistAccount = false"
    >
      <p>Business</p>
    </div>
  </div>

  <button type="button" @click="emitValues">Continue</button>
</template>

<style scoped>
.specialist-business-container {
  display: flex;

  & .business {
    border: 1px solid transparent;
    padding: 24px;
  }

  & .specialist {
    border: 1px solid transparent;
    padding: 24px;
  }

  div.selected {
    border-color: rgb(144 53 183);
  }
}
</style>
