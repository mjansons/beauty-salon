<script setup lang="ts">
import HeaderAuth from '@/components/headers/HeaderAuth.vue'
import { ref, onBeforeMount } from 'vue'
import { getSpecialistAppointments } from '@/stores/trpcCalls'

const appointments = ref<
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

onBeforeMount(async () => {
  appointments.value = await getSpecialistAppointments()
})
</script>

<template>
  <HeaderAuth></HeaderAuth>
  <h1></h1>
  <div class="appointment-wrapper">
    <p>Upcoming appointments:</p>
    <p v-if="appointments.length === 0">No upcoming appointments</p>
    <div
      v-for="appointment in appointments"
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
</template>
