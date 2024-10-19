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
    <button type="button" @click="isDisplayed = false"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.17844 5.82147C7.52757 5.1706 6.47229 5.17059 5.82141 5.82146C5.17054 6.47233 5.17053 7.52761 5.8214 8.17848L9.64285 12L5.8214 15.8215C5.17053 16.4724 5.17054 17.5276 5.82141 18.1785C6.47229 18.8294 7.52757 18.8294 8.17844 18.1785L11.9999 14.357L15.8213 18.1785C16.4722 18.8294 17.5274 18.8294 18.1783 18.1785C18.8292 17.5276 18.8292 16.4724 18.1783 15.8215L14.3569 12L18.1783 8.17848C18.8292 7.52761 18.8292 6.47233 18.1783 5.82146C17.5274 5.17059 16.4722 5.1706 15.8213 5.82147L11.9999 9.64294L8.17844 5.82147Z" fill="#200179"/>
</svg>
</button>
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
  background-color: var(--green);

  border-radius: 12px;
  text-align: center;
  padding: 16px;
  color: var(--purple-900);

  & p {
    color: var(--purple-900);
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
  color: var(--purple-900);
  cursor: pointer;

  & svg {
    width: 24px;
    height: 24px;
  }
}

button:hover {
  opacity: 0.75;
}

button:active {
  border-radius: 8px;
  opacity: 0.35;
}
</style>
