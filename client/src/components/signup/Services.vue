<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import useBusinessStore from '@/stores/businessStore'

const businessStore = useBusinessStore()
const emit = defineEmits(['nextStep', 'services', 'previousStep'])

const emitPreviousStep = () => {
  emit('previousStep')
}

const svgModules = import.meta.glob(
  '../../assets/images/specialityImages/*.svg',
  {
    query: '?raw',
    import: 'default',
    eager: true, // Preload the SVGs at build time
  }
)

const defaultSvgContent =
  svgModules['../../assets/images/specialityImages/default.svg']

const services = ref<{ name: string; selected: boolean; svgContent: string }[]>(
  []
)

onBeforeMount(async () => {
  businessStore.allSpecialities = await trpc.business.getAllSpecialities.query()

  services.value = businessStore.allSpecialities.map((speciality) => {
    const filePath = `../../assets/images/specialityImages/${speciality.speciality}.svg`
    const svgContent = (svgModules[filePath] || defaultSvgContent) as string

    // const currentImage = imgLink(speciality.speciality)
    return {
      name: speciality.speciality,
      selected: false,
      svgContent,
    }
  })
})

const toggleService = (index: number) => {
  services.value[index].selected = !services.value[index].selected
}

const emitValues = () => {
  const offeredServices = services.value
    .filter((speciality) => speciality.selected)
    .map((speciality) => speciality.name)
  emit('nextStep')
  emit('services', offeredServices)
}
</script>

<template>
  <div class="background">
    <div class="modal-wrapper">
      <div class="back-button-wrapper">
        <div class="back-button" @click="emitPreviousStep">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#3604C4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.6536 16.4928C11.3814 16.8051 10.9076 16.8375 10.5954 16.5653L6.00715 12.5653C5.84377 12.4229 5.75 12.2167 5.75 12C5.75 11.7832 5.84377 11.5771 6.00715 11.4347L10.5954 7.43466C10.9076 7.16247 11.3814 7.19491 11.6536 7.50714C11.9258 7.81936 11.8933 8.29312 11.5811 8.56532L8.50161 11.25L17.5 11.25C17.9142 11.25 18.25 11.5858 18.25 12C18.25 12.4142 17.9142 12.75 17.5 12.75L8.50161 12.75L11.5811 15.4347C11.8933 15.7069 11.9258 16.1806 11.6536 16.4928Z"
              fill="#6C38FF"
            />
          </svg>

          <p>Back</p>
        </div>
      </div>
      <h1>What services do you offer?</h1>
      <p class="disclaimer">
        By signing up you agree to Winks’ Privacy Policy & Terms of Service
      </p>
      <div class="services-container">
        <div
          v-for="(service, index) in services"
          :key="service.name"
          @click="toggleService(index)"
          class="type-button"
          :class="{ selected: service.selected }"
        >
          <div class="svg-container" v-html="service.svgContent"></div>
          <p>{{ service.name }}</p>
        </div>
      </div>

      <div class="button-wrapper">
        <button type="button" @click="emitValues" class="btn-primary">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: Calistoga, sans-serif;
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
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  width: 550px;
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 16px;

  & :deep(svg) {
    width: 36px;
    height: 36px;
    margin-bottom: 24px;
  }
}

div.selected {
  border: 1px solid var(--purple-500);
  border-radius: 16px;

  & :deep(path) {
    fill: var(--purple-500);
  }

  & p {
    color: var(--purple-500);
  }
}

.type-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 0;
  border: 1px solid transparent;
  font-size: var(--medium);
  padding: 24px;
  background-color: var(--gray);
  border-radius: 16px;
}

.type-button:hover {
  background-color: var(--purple-100);
}

.button-wrapper {
  width: 100%;
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  margin-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: auto;
}

.disclaimer {
  font-size: var(--small);
  color: var(--gray-500);
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;
  text-align: left;
}
</style>
