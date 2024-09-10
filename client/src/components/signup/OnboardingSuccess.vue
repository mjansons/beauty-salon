<script lang="ts" setup>
import router from '@/router'

const emit = defineEmits(['nextStep'])
const finishOnboarding = () => {
  emit('nextStep')
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <h1>That's about it!</h1>
  <button type="button" @click="finishOnboarding">I consent to donate my kidney</button>
</template>

<style scoped></style>
