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
import FooterElement from '@/components/FooterElement.vue'

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
    specialistFirstName: string
    specialistLastName: string
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

const businessAppointmentsList = ref<
  {
    business: {
      id: number
      name: string
    }
    appointments: {
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
  }[]
>([])

onBeforeMount(async () => {
  userRoles.value = await getUserRoles()

  // Fetch personal appointments
  personalAppointments.value = await getPesronalAppointments()

  if (userRoles.value.includes('owner')) {
    const businesses = await getOwnerBusinesses()
    if (businesses.length > 0) {
      // Fetch appointments for each business
      const appointmentsPromises = businesses.map(async (business) => {
        const appointments = await getBusinessAppointments({
          businessId: business.id,
        })
        return {
          business: {
            id: business.id,
            name: business.name,
          },
          appointments,
        }
      })
      businessAppointmentsList.value = await Promise.all(appointmentsPromises)
    }
  }

  if (userRoles.value.includes('specialist')) {
    specialistAppointments.value = await getSpecialistAppointments()
  }
})

function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short', // 'Mon'
    month: 'short', // 'Oct'
    day: 'numeric', // '21'
    year: 'numeric', // '2024'
    hour: '2-digit', // '11'
    minute: '2-digit', // '00'
    hour12: false,
  })
}
</script>

<template>
  <HeaderAuth></HeaderAuth>
  <!-- Business Appointments Section -->
  <div class="all-appointment-wrapper">
    <div v-if="userRoles.includes('owner')" class="appointment-container">
      <h1>Upcoming business appointments</h1>
      <div v-if="businessAppointmentsList.length === 0">
        <p>No upcoming appointments</p>
      </div>
      <div v-else class="businesses-wrapper">
        <!-- Loop through each business and its appointments -->
        <div
          v-for="businessData in businessAppointmentsList"
          :key="businessData.business.id"
          class="business"
        >
          <!-- Business Name -->
          <h2>{{ businessData.business.name }}</h2>
          <!-- Check if the business has appointments -->
          <div v-if="businessData.appointments.length === 0">
            <p>No appointments for this business, yet!</p>
          </div>
          <div v-else class="appointment-wrapper">
            <!-- Loop through appointments for this business -->
            <div
              v-for="appointment in businessData.appointments"
              :key="
                appointment.appointmentStartTime.toISOString() +
                '-' +
                appointment.clientPhoneNumber
              "
              class="appointment"
            >
              <div class="detail-wrapper">
                <h4>Start time</h4>
                <p>{{ formatDate(appointment.appointmentStartTime) }}</p>
              </div>

              <div class="detail-wrapper">
                <h4>End time</h4>
                <p>{{ formatDate(appointment.appointmentEndTime) }}</p>
              </div>
              <div class="detail-wrapper">
                <h4>Client</h4>
                <p>
                  {{ appointment.clientFirstName }}
                  {{ appointment.clientLastName }}
                </p>
              </div>
              <div class="detail-wrapper">
                <h4>Client number</h4>
                <p>{{ appointment.clientPhoneNumber }}</p>
              </div>
              <div v-if="appointment.comment" class="detail-wrapper">
                <h4>Comment</h4>
                <p>{{ appointment.comment }}</p>
              </div>

              <div class="detail-wrapper">
                <h4>Specailist</h4>
                <p>
                  {{ appointment.specialistFirstName }}
                  {{ appointment.specialistLastName }}
                </p>
              </div>
              <div class="detail-wrapper">
                <h4>Service</h4>
                <p>{{ appointment.speciality }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Specialist Appointments Section -->
    <div v-if="userRoles.includes('specialist')" class="appointment-container">
      <h1>Upcoming specialist appointments</h1>
      <div v-if="specialistAppointments.length === 0">
        <p>No upcoming appointments</p>
      </div>
      <div v-else class="appointment-wrapper">
        <div
          v-for="appointment in specialistAppointments"
          :key="appointment.appointmentStartTime.toISOString()"
          class="appointment"
        >
          <div class="detail-wrapper">
            <h4>Start time</h4>
            <p>{{ formatDate(appointment.appointmentStartTime) }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>End time</h4>
            <p>{{ formatDate(appointment.appointmentEndTime) }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>Client</h4>
            <p>{{ appointment.firstName }} {{ appointment.lastName }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>Client number</h4>
            <p>{{ appointment.phoneNumber }}</p>
          </div>
          <div v-if="appointment.comment" class="detail-wrapper">
            <h4>Comment</h4>
            <p>{{ appointment.comment }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>Service</h4>
            <p>{{ appointment.speciality }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Appointments Section -->
    <div class="appointment-container">
      <h1>Upcoming personal appointments</h1>
      <div v-if="personalAppointments.length === 0">
        <p>No upcoming personal appointments</p>
      </div>
      <div v-else class="appointment-wrapper">
        <div
          v-for="appointment in personalAppointments"
          :key="appointment.appointmentStartTime.toISOString()"
          class="appointment"
        >
          <div class="detail-wrapper">
            <h4>Start time</h4>
            <p>{{ formatDate(appointment.appointmentStartTime) }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>End time</h4>
            <p>{{ formatDate(appointment.appointmentEndTime) }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>Specialist</h4>
            <p>
              {{ appointment.specialistFirstName }}
              {{ appointment.specialistLastName }}
            </p>
          </div>
          <div class="detail-wrapper">
            <h4>Salon number</h4>
            <p>{{ appointment.phoneNumber }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>Service</h4>
            <p>{{ appointment.speciality }}</p>
          </div>
          <div class="detail-wrapper">
            <h4>Price</h4>
            <p>{{ appointment.price }} EUR</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterElement></FooterElement>
</template>

<style scoped>
h1 {
  font-family: Calistoga, sans-serif;
  margin-bottom: 16px;
}

h4 {
  margin: 0;
}

.all-appointment-wrapper {
  display: flex;
  gap: 16px;
  padding: 32px;
  flex-direction: column;
}

.appointment-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: 16px;
}
.businesses-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.business {
  padding: 16px;
  background-color: var(--gray-100);
  border: 2px dashed var(--purple-100);
  border-radius: 16px;
}

.appointment-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment {
  padding: 16px;
  background-color: var(--gray-100);
  border: 2px dashed var(--purple-100);
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}
</style>
