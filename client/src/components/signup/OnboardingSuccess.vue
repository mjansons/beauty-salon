<script lang="ts" setup>
const emit = defineEmits(['nextStep'])
const finishOnboarding = () => {
  emit('nextStep')
}
</script>

<template>
  <h1>That's about it, you can log in now!</h1>
  <button type="button" @click="finishOnboarding">Log in</button>
</template>

<!-- <style scoped></style> -->
