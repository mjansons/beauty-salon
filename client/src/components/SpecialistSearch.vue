<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import {
  getAllSpecialities,
  getAllLocations,
  getSpecialistSlots,
} from '../stores/trpcCalls'

const services = ref<{ id: number; speciality: string }[]>([])
const locations = ref<string[]>([])

const selectedService = ref('')
const selectedLoacation = ref('')
const selectedDate = ref('')
const slots = ref<
  {
    specialistId: number
    businessId: number
    address: string
    city: string
    businessEmail: string
    businessPhoneNumber: string
    postalCode: string
    specialityId: number
    specialityName: string
  }[]
>([])
// slots example
const example = [
  {
    specialistId: 1,
    businessId: 1,
    address: 'lutrinu strret',
    city: 'riga',
    businessEmail: 'big@gmail.com',
    businessPhoneNumber: '+37112341234',
    postalCode: 'lv-1002',
    specialityId: 1,
    specialityName: 'haircut',
    price: 30,
    specialistFirstName: 'matiss',
    specialistLastName: 'jansons',
    workingHours: {
      '1': ['12:00:00', '14:00:00'],
      '2': ['12:00:00', '14:00:00'],
    },
    bookings: {},
  },
  {
    specialistId: 1,
    businessId: 1,
    address: 'lutrinu strret',
    city: 'riga',
    businessEmail: 'big@gmail.com',
    businessPhoneNumber: '+37112341234',
    postalCode: 'lv-1002',
    specialityId: 1,
    specialityName: 'haircut',
    price: 60,
    specialistFirstName: 'matiss',
    specialistLastName: 'jansons',
    workingHours: {
      '1': ['12:00:00', '14:00:00'],
      '2': ['12:00:00', '14:00:00'],
    },
    bookings: {},
  },
  {
    specialistId: 1,
    businessId: 1,
    address: 'lutrinu strret',
    city: 'riga',
    businessEmail: 'big@gmail.com',
    businessPhoneNumber: '+37112341234',
    postalCode: 'lv-1002',
    specialityId: 1,
    specialityName: 'haircut',
    price: 60,
    specialistFirstName: 'matiss',
    specialistLastName: 'jansons',
    workingHours: {
      '1': ['12:00:00', '14:00:00'],
      '2': ['12:00:00', '14:00:00'],
    },
    bookings: {},
  },
]

const currentDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})
onBeforeMount(async () => {
  services.value = await getAllSpecialities()
  locations.value = await getAllLocations()
})

async function findSpecialist() {
  console.log("finding specialist")
  slots.value = await getSpecialistSlots({
    date: selectedDate.value,
    location: selectedLoacation.value,
    service: selectedService.value,
  })
}
</script>

<template>
  {{ selectedService }}
  {{ selectedLoacation }}
  {{ selectedDate }}
  <div>
    <form @submit.prevent="findSpecialist">
      <select name="service" v-model="selectedService" required>
        <option disabled value="">Select a service</option>
        <option
          v-for="service in services"
          :key="service.id"
          :value="service.speciality"
        >
          {{ service.speciality }}
        </option>
      </select>
      <select name="location" v-model="selectedLoacation" required>
        <option disabled value="">Select a Location</option>
        <option v-for="location in locations" :key="location" :value="location">
          {{ location }}
        </option>
      </select>
      <input
        type="date"
        name="date"
        id="date"
        :min="currentDate"
        v-model="selectedDate"
        required
      />
      <button type="submit">Search</button>
    </form>
  </div>
  {{ slots }}
</template>

<style scoped></style>
