<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['nextStep'])

const emitValues = () => {
  emit('nextStep')
}
</script>

<template>
  <h1>What services do you offer?</h1>
  <div class="services-container">
    <div>
      <p>hair</p>
    </div>
    <div>
      <p>nails</p>
    </div>
    <div>
      <p>makeup</p>
    </div>
  </div>

  <button type="button" @click="emitValues">Continue</button>
</template>

<style scoped>
.services-container {
  display: flex;
}
</style>
