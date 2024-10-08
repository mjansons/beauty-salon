<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  showToast: boolean
  buttonText?: string
}>()

const buttonText = computed(() => {
  return props.buttonText ? props.buttonText : 'Changes saved successfully!'
})

const isDisplayed = ref(props.showToast)

watch(
  () => props.showToast,
  (newVal) => {
    isDisplayed.value = newVal
  }
)
</script>

<template>
  <div v-if="isDisplayed" class="info-toast">
    <p>{{ buttonText }}</p>
    <button type="button" @click="isDisplayed = false">x</button>
  </div>
</template>

<style scoped>
.info-toast {
  display: flex;
  flex-flow: row nowrap;
  place-content: center center;
  align-items: center;
  font-size: 16px;
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(
    0 128 0 / 90%
  ); /* Greenish background with transparency */

  border-radius: 12px;
  text-align: center;
  padding: 16px;
  color: white; /* Text color */

  & p {
    color: white; /* Greenish text color */
  }
}

button {
  display: flex;
  place-content: center center;
  align-items: center;
  background-color: transparent;
  padding: 0;
  margin-left: 8px;
  border: none;
  font-size: 18px;
  color: white; /* Close button color */
  cursor: pointer;
}

button:hover {
  opacity: 0.75;
}

button:active {
  border-radius: 8px;
  opacity: 0.35;
}
</style>
