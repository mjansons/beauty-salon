<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import {
  getOwnerBusinesses,
  updateBusinessDetails,
} from '@/stores/trpcCalls'
import BusinessDetails from '../signup/BusinessDetails.vue'
import InfoToast from './InfoToast.vue'
import InviteSender from './InviteSender.vue'
import EmployeeList from './EmployeeList.vue'
import BusinessServices from './BusinessServices.vue'
import BusinessHours from './BusinessHours.vue'

const showToast = ref(false)

const myBusinesses = ref<
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

const myUpdatedBusiness = ref<{
  businessId: number
  address: string
  email: string
  phoneNumber: string
  name: string
  city: string
  postalCode: string
}>()

onBeforeMount(async () => {
  myBusinesses.value = await getOwnerBusinesses()
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
  myUpdatedBusiness.value = value
}

async function updateBusiness() {
  if (myUpdatedBusiness.value) {
    try {
      await updateBusinessDetails(myUpdatedBusiness.value)

      myBusinesses.value = await getOwnerBusinesses()

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
  <!-- <h1>owner account details</h1> -->
  <div v-for="business in myBusinesses" :key="business.id">
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
    <EmployeeList :businessId="business.id" />
    <InviteSender :businessId="business.id" />
    <BusinessServices :businessId="business.id" />
    <BusinessHours :businessId="business.id" />

  </div>
</template>

<!-- <style scoped></style> -->
