<script lang="ts" setup>
const emit = defineEmits(['nextStep'])
const finishOnboarding = () => {
  emit('nextStep')
}
</script>

<template>
    <div class="background">
      <div class="modal-wrapper">
  <p>That's about it, you can log in now!</p>
  <button type="button" @click="finishOnboarding" class="btn-primary">Log in</button>
      </div>
    </div>
</template>

<style scoped>
p {
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
</style>
