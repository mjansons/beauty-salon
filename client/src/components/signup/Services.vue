<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import useBusinessStore from '@/stores/businessStore'

const businessStore = useBusinessStore()
const emit = defineEmits(['nextStep', 'services'])

const imgLink = (img: string) => {
  return new URL(
    `../../assets/images/specialityImages/${img}.svg`,
    import.meta.url
  ).href
}

const defaultImage = new URL(
  '../../assets/images/specialityImages/default.svg',
  import.meta.url
).href

const services = ref<{ name: string; selected: boolean; img: string }[]>([])

onBeforeMount(async () => {
  businessStore.allSpecialities = await trpc.business.getAllSpecialities.query()

  services.value = businessStore.allSpecialities.map((speciality) => {
    const currentImage = imgLink(speciality.speciality)
    return {
      name: speciality.speciality,
      selected: false,
      img: currentImage,
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
  <h1>What services do you offer?</h1>
  <div class="services-container">
    <div
      v-for="(service, index) in services"
      :key="service.name"
      @click="toggleService(index)"
      class="service"
      :class="{ selected: service.selected }"
    >
      <img
        :src="service.img"
        :alt="service.name"
        @error="
          (e) => {
            ;(e.target as HTMLImageElement).src = defaultImage
          }
        "
      />
      <p>{{ service.name }}</p>
    </div>
  </div>

  <button type="button" @click="emitValues">Continue</button>
</template>

<style scoped>
.services-container {
  display: flex;
  flex-wrap: wrap;
}

.service {
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  cursor: pointer;
}
div > .selected {
  border: 1px solid red;
}
</style>
