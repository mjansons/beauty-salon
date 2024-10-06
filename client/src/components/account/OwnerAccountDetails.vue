<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { getOwnerBusinesses, updateBusinessDetails } from '@/stores/trpcCalls'
import BusinessDetails from '../signup/BusinessDetails.vue'
import InfoToast from './InfoToast.vue'

const showToast = ref(false)

const businesses = ref<
  {
    address: string
    id: number
    email: string
    phoneNumber: string
    createdAt: Date
    name: string
    ownerId: number
    city: string
    postalCode: string
  }[]
>([])

const updatedBusiness = ref<{
  businessId: number
  address: string
  email: string
  phoneNumber: string
  name: string
  city: string
  postalCode: string
}>()

onBeforeMount(async () => {
  businesses.value = await getOwnerBusinesses()
  // get owner businesses
  // get owner schedule
  // get owner specialities
})

function receiveBusinessDetails(value: {
  businessId: number
  name: string
  address: string
  city: string
  postalCode: string
  email: string
  phoneNumber: string
}) {
  updatedBusiness.value = value
}

async function updateBusiness() {
  if (updatedBusiness.value) {
    try {
      await updateBusinessDetails(updatedBusiness.value)

      businesses.value = await getOwnerBusinesses()

      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 1500)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <InfoToast :showToast="showToast" />
  <h1>owner account details</h1>
  <div v-for="business in businesses" :key="business.id">
    <BusinessDetails
      :buttonText="'Save changes'"
      :defaultBusinessDetails="{
        id: business.id,
        name: business.name,
        address: business.address,
        city: business.city,
        postalCode: business.postalCode,
        email: business.email,
        phoneNumber: business.phoneNumber,
      }"
      @business-details="receiveBusinessDetails"
      @next-step="updateBusiness"
    />
  </div>
  <!-- Company details? -->
  <!-- Invitation sending -->
  <!-- Schedule -->
  <!-- Specialities and their price-->
</template>

<!-- <style scoped></style> -->
