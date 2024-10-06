<script setup lang="ts">
import HeaderAuth from '@/components/headers/HeaderAuth.vue'
import { ref, onBeforeMount } from 'vue'
import {
  getSpecialistAppointments,
  getBusinessAppointments,
  getPesronalAppointments,
  getOwnerBusinesses,
} from '@/stores/trpcCalls'
import { getUserRoles } from '@/stores/trpcCalls'

const userRoles = ref<string[]>([])

const personalAppointments = ref<
  {
    phoneNumber: string
    address: string
    name: string
    city: string
    postalCode: string
    price: number
    appointmentEndTime: Date
    appointmentStartTime: Date
    speciality: string
    SpecialistFirstName: string
    SpecialistLastName: string
  }[]
>([])

const specialistAppointments = ref<
  {
    firstName: string
    lastName: string
    phoneNumber: string
    appointmentEndTime: Date
    appointmentStartTime: Date
    comment: string | null
    speciality: string
  }[]
>([])

const businessAppointments = ref<
  {
    speciality: string
    appointmentStartTime: Date
    appointmentEndTime: Date
    clientFirstName: string
    clientLastName: string
    clientPhoneNumber: string
    comment: string | null
    specialistFirstName: string
    specialistLastName: string
  }[]
>([])

onBeforeMount(async () => {
  userRoles.value = await getUserRoles()

  // business appointments
  // specialist appointments
  personalAppointments.value = await getPesronalAppointments()

  if (userRoles.value.includes('owner')) {
    const businesses = await getOwnerBusinesses()
    if (businesses.length > 0) {
      businessAppointments.value = await getBusinessAppointments({
        businessId: businesses[0].id,
      })
    }
  }
  if (userRoles.value.includes('specialist')) {
    specialistAppointments.value = await getSpecialistAppointments()
  }
})
</script>

<template>
  <HeaderAuth></HeaderAuth>
  <div v-if="userRoles.includes('owner')" class="appointment-wrapper">
    <h4>Upcoming owner appointments:</h4>
    <p v-if="businessAppointments.length === 0">No upcoming appointments</p>
    <div
      v-for="appointment in businessAppointments"
      :key="appointment.appointmentStartTime.toISOString()"
    >
      <p>{{ appointment.speciality }}</p>
      <p>{{ appointment.appointmentStartTime }}</p>
      <p>{{ appointment.appointmentEndTime }}</p>
      <p>
        {{ appointment.specialistFirstName }}
        {{ appointment.specialistLastName }}
      </p>
      <p>{{ appointment.clientFirstName }} {{ appointment.clientLastName }}</p>
      <p>{{ appointment.clientPhoneNumber }}</p>
      <p>{{ appointment.comment }}</p>
    </div>
  </div>
  <div v-if="userRoles.includes('specialist')" class="appointment-wrapper">
    <h4>Upcoming specialist appointments:</h4>
    <p v-if="specialistAppointments.length === 0">No upcoming appointments</p>
    <div
      v-for="appointment in specialistAppointments"
      :key="appointment.appointmentStartTime.toISOString()"
    >
      <p>{{ appointment.speciality }}</p>
      <p>{{ appointment.appointmentStartTime }}</p>
      <p>{{ appointment.appointmentEndTime }}</p>
      <p>{{ appointment.firstName }} {{ appointment.lastName }}</p>
      <p>{{ appointment.phoneNumber }}</p>
      <p>{{ appointment.comment }}</p>
    </div>
  </div>

  <div class="appointment-wrapper">
    <h4>Upcoming personal appointments:</h4>
    <p v-if="personalAppointments.length === 0">No upcoming appointments</p>
    <div
      v-for="appointment in personalAppointments"
      :key="appointment.appointmentStartTime.toISOString()"
    >
      <p>{{ appointment.speciality }}</p>
      <p>{{ appointment.appointmentStartTime }}</p>
      <p>{{ appointment.appointmentEndTime }}</p>
      <p>{{ appointment.SpecialistFirstName }} {{ appointment.SpecialistLastName }}</p>
      <p>{{ appointment.phoneNumber }}</p>
      <p>{{ appointment.price }}</p>
    </div>
  </div>
</template>
