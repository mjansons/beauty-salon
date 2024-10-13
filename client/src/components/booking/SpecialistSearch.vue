<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import {
  getAllSpecialities,
  getAllLocations,
  getSpecialistSlots,
} from '../../stores/trpcCalls'
import UnregisteredModal from './UnregisteredModal.vue'
import RegisteredModal from './RegisteredModal.vue'
import { isLoggedIn } from '@/stores/user'

const emit = defineEmits(['response'])

const services = ref<{ id: number; speciality: string }[]>([])
const locations = ref<string[]>([])
const selectedService = ref('')
const selectedLoacation = ref('')
const selectedDate = ref('')
const specialists = ref<any[]>([])
const isUnregisteredModalOn = ref(false)
const isRegisteredModalOn = ref(false)

const showBackButton = computed(() => {
  const selected = new Date(selectedDate.value)
  selected.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  today.setDate(today.getDate() + 3)

  console.log('Selected Date:', selected)
  console.log('Today + 3:', today)

  return selected >= today
})

const signupForm = ref({
  businessName: '',
  address: '',
  city: '',
  specialistFirstName: '',
  specialistLastName: '',
  price: 0,
  specialityName: '',
  clientId: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  businessId: 0,
  businessSpecialityId: 0,
  specialistId: 0,
  appointmentStartTime: new Date(),
  appointmentEndTime: new Date(),
  comment: undefined,
})

onBeforeMount(async () => {
  services.value = await getAllSpecialities()
  locations.value = await getAllLocations()
})

const currentDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const searchPressed = ref(false)
const page = ref(1)
const lastFetchCount = ref(0)

async function findSpecialist() {
  searchPressed.value = true
  page.value = 1
  const fetchedSpecialists = await getSpecialistSlots({
    date: selectedDate.value,
    location: selectedLoacation.value,
    service: selectedService.value,
    page: page.value,
  })

  specialists.value = fetchedSpecialists
  lastFetchCount.value = fetchedSpecialists.length

  emit('response', searchPressed.value)
}

async function loadMore() {
  page.value++

  const fetchedSpecialists = await getSpecialistSlots({
    date: selectedDate.value,
    location: selectedLoacation.value,
    service: selectedService.value,
    page: page.value,
  })

  specialists.value.push(...fetchedSpecialists)
  lastFetchCount.value = fetchedSpecialists.length
}

// const specialistExample = [
//   {
//     specialistId: 1,
//     businessId: 1,
//     address: 'lutrinu strret',
//     city: 'riga',
//     businessEmail: 'big@gmail.com',
//     businessPhoneNumber: '+37112341234',
//     postalCode: 'lv-1002',
//     specialityId: 1,
//     specialityName: 'haircut',
//     price: 30,
//     specialistFirstName: 'matiss',
//     specialistLastName: 'jansons',
//     workingHours: {
//       '1': ['12:00:00', '20:00:00'],
//       '2': ['12:00:00', '20:00:00'],
//     },
//     bookings: {
//       '2024-09-24': [
//         { start: '11:28:35', end: '12:28:35' },
//         { start: '14:28:35', end: '15:28:35' },
//       ],
//       '2024-10-21': [{ start: '14:28:35', end: '15:28:35' }],
//     },
//   },
// ]

// Helper function to generate the next seven days

function getNextDays(dayAmount: number) {
  const days = []
  const today = new Date(selectedDate.value)
  for (let i = 0; i < dayAmount; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      date: date.toISOString().split('T')[0],
      dateString: date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      }),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
    })
  }
  return days
}

// Function to generate time slots
function generateTimeSlots(
  startTime: string,
  endTime: string,
  dateString: string
) {
  const slots = []
  const start = new Date(`${dateString}T${startTime}Z`)
  const end = new Date(`${dateString}T${endTime}Z`)

  const today = new Date().toISOString().split('T')[0]
  if (dateString === today) {
    const now = new Date()
    // Add 1 hour to current time
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    // Round up to the next 30-minute slot
    const minutes = oneHourLater.getMinutes()
    const roundedMinutes =
      minutes % 30 === 0 ? minutes : minutes + (30 - (minutes % 30))
    oneHourLater.setMinutes(roundedMinutes, 0, 0)
    // Adjust hours if rounded minutes exceed 60
    if (roundedMinutes >= 60) {
      oneHourLater.setHours(oneHourLater.getHours() + 1)
      oneHourLater.setMinutes(0, 0, 0)
    }

    // Set 'start' to the later of the working start time and one hour later
    if (oneHourLater > start) {
      start.setTime(oneHourLater.getTime())
    }
  }

  while (start < end) {
    const slotTime = start.toTimeString().split(' ')[0].slice(0, 5) // HH:MM format
    slots.push({ slotTime, slotDateObj: new Date(start) }) // Clone the Date object
    start.setMinutes(start.getMinutes() + 30) // Increment by 30 minutes
  }
  return slots
}

function selectSlot(
  businessName: string,
  address: string,
  city: string,
  specialistFirstName: string,
  specialistLastName: string,
  price: number,
  specialityName: string,
  businessId: number,
  businessSpecialityId: number,
  specialistId: number,
  appointmentStartTime: Date
) {
  signupForm.value.businessName = businessName
  signupForm.value.address = address
  signupForm.value.city = city
  signupForm.value.specialistFirstName = specialistFirstName
  signupForm.value.specialistLastName = specialistLastName
  signupForm.value.price = price
  signupForm.value.specialityName = specialityName
  signupForm.value.businessId = businessId
  signupForm.value.businessSpecialityId = businessSpecialityId
  signupForm.value.specialistId = specialistId
  signupForm.value.appointmentStartTime = appointmentStartTime

  const appointmentEndTime = new Date(appointmentStartTime)
  appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + 30)
  signupForm.value.appointmentEndTime = appointmentEndTime

  if (!isLoggedIn.value) {
    isUnregisteredModalOn.value = true
  }

  if (isLoggedIn.value) {
    isRegisteredModalOn.value = true
  }
}

function isSlotBooked(
  specialist: any,
  slot: {
    slotTime: string
    slotDateObj: Date
  }
) {
  const slotDate = slot.slotDateObj.toISOString().split('T')[0]
  const bookings = specialist.bookings[slotDate]
  if (!bookings) return false

  return bookings.some((booking: { start: string; end: string }) => {
    // Adjust booking start and end times from UTC to UTC+3
    const bookingStart = new Date(`${slotDate}T${booking.start}Z`)
    const bookingEnd = new Date(`${slotDate}T${booking.end}Z`)

    // Compare the time slot with booking times
    return slot.slotDateObj >= bookingStart && slot.slotDateObj < bookingEnd
  })
}

function isSlotSelected(specialistId: number, dateObj: Date) {
  return (
    signupForm.value.specialistId === specialistId &&
    signupForm.value.appointmentStartTime.getTime() === dateObj.getTime()
  )
}

function goBackDays(days: number) {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() - days)
  selectedDate.value = newDate.toISOString().split('T')[0]
}

function goForwardDays(days: number) {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() + days)
  selectedDate.value = newDate.toISOString().split('T')[0]
}
</script>

<template>
  <div>
    <form
      @submit.prevent="findSpecialist"
      :class="{ 'form-as-header': searchPressed }"
    >
      <select name="service" v-model="selectedService" required>
        <option disabled value="">Service</option>
        <option
          v-for="service in services"
          :key="service.id"
          :value="service.speciality"
        >
          {{ service.speciality }}
        </option>
      </select>
      <select name="location" v-model="selectedLoacation" required>
        <option disabled value="">Location</option>
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
      <button
        type="submit"
        :class="searchPressed ? 'btn-secondary' : 'btn-primary'"
      >
        Search
      </button>
    </form>

    <div class="no-results" v-if="specialists.length === 0 && searchPressed">
      <img src="../../assets/images/EmptyState.svg" alt="no results" />
      <h3>No results, try something else...</h3>
    </div>
    <div v-if="specialists.length > 0">
      <div
        v-for="specialist in specialists"
        :key="specialist.specialistId"
        class="specialist-container"
      >
        <!-- Specialist Info -->
        <div class="info-container">
          <div class="specialist-info-wrapper">
            <img src="../../assets/images/Avatars.png" alt="profile picture" />
            <div class="specialist-info">
              <h2>
                {{
                  specialist.specialistFirstName.charAt(0).toUpperCase() +
                  specialist.specialistFirstName.slice(1)
                }}
                {{
                  specialist.specialistLastName.charAt(0).toUpperCase() +
                  specialist.specialistLastName.slice(1)
                }}
              </h2>
              <p>
                {{
                  specialist.businessName.charAt(0).toUpperCase() +
                  specialist.businessName.slice(1)
                }},
                {{
                  specialist.address.charAt(0).toUpperCase() +
                  specialist.address.slice(1)
                }}, {{ specialist.postalCode.toUpperCase() }},
                {{
                  specialist.city.charAt(0).toUpperCase() +
                  specialist.city.slice(1)
                }}
              </p>
            </div>
          </div>

          <div class="speciality-info-wrapper">
            <h3>
              {{
                specialist.specialityName.charAt(0).toUpperCase() +
                specialist.specialityName.slice(1)
              }}
            </h3>
            <p>{{ specialist.price }} EUR</p>
          </div>
        </div>

        <!-- Availability Calendar -->
        <div class="calendar-wrapper">
          <button
            class="btn-secondary arrow"
            type="button"
            @click="goBackDays(3)"
            :disabled="!showBackButton"
          >
            <img
              src="../../assets/images/arrows/arrow-left.svg"
              alt="arrow left"
            />
          </button>
          <div class="calendar">
            <div class="calendar-header">
              <div
                class="calendar-day-header"
                v-for="day in getNextDays(3)"
                :key="day.date"
              >
                <div class="date-wrapper">
                  <h3>{{ day.dayOfWeek }}</h3>
                  <p>{{ day.dateString }}</p>
                </div>
              </div>
            </div>
            <div class="calendar-body">
              <div
                class="calendar-day-body"
                v-for="day in getNextDays(3)"
                :key="day.date"
              >
                <!-- Check if specialist works on this day -->
                <div
                  v-if="specialist.workingHours[new Date(day.date).getDay()]"
                >
                  <div class="slots">
                    <button
                      v-for="slot in generateTimeSlots(
                        specialist.workingHours[new Date(day.date).getDay()][0],
                        specialist.workingHours[new Date(day.date).getDay()][1],
                        day.date
                      )"
                      :key="slot.slotTime"
                      :disabled="isSlotBooked(specialist, slot)"
                      :class="{
                        selected: isSlotSelected(
                          specialist.specialistId,
                          slot.slotDateObj
                        ),
                      }"
                      class="btn-secondary slot-button"
                      @click="
                        selectSlot(
                          specialist.businessName,
                          specialist.address,
                          specialist.city,
                          specialist.specialistFirstName,
                          specialist.specialistLastName,
                          specialist.price,
                          specialist.specialityName,
                          specialist.businessId,
                          specialist.businessSpecialityId,
                          specialist.specialistId,
                          slot.slotDateObj
                        )
                      "
                    >
                      {{ slot.slotTime }}
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p>Not available</p>
                </div>
              </div>
            </div>
          </div>
          <button
            class="btn-secondary arrow"
            type="button"
            @click="goForwardDays(3)"
          >
            <img
              src="../../assets/images/arrows/arrow-right.svg"
              alt="arrow left"
            />
          </button>
        </div>
      </div>
      <div class="more-button-wrapper">
      <button type="button" v-if="lastFetchCount === 10" @click="loadMore" class="btn-secondary">
        Load More
      </button>
    </div>
    </div>


  </div>
  <!-- Modals -->
  <UnregisteredModal
    v-if="isUnregisteredModalOn"
    :signup-form="signupForm"
    @isUnregisteredModalOn="(v) => (isUnregisteredModalOn = v)"
  ></UnregisteredModal>
  <RegisteredModal
    v-if="isRegisteredModalOn"
    :signup-form="signupForm"
    @isRegisteredModalOn="(v) => (isRegisteredModalOn = v)"
  ></RegisteredModal>
</template>

<style scoped>

.more-button-wrapper {
  display: flex;
  justify-content: center;
  margin: 32px auto;
  max-width: 120px;
}
.arrow {
  display: flex;
  flex-grow: 0;
  padding: 8px;

  & img {
    width: 16px;
  }
}

.btn-primary {
  font-weight: 400;
  padding-left: 40px;
  padding-right: 40px;
  flex: 1 1 0;
}

.slot-button {
  margin: 16px 0;
}

.slot-button:disabled {
  margin: 16px 0;
  background-color: var(--gray);
  border-color: transparent;
  color: var(--purple-300);
  text-decoration: line-through;
}

.specialist-container {
  border-radius: 16px;
  background-color: var(--white);
  padding: 24px;
  margin: 16px 10%;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 24px;

  & img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
}

.specialist-info-wrapper {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: flex-start;
}

.specialist-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & h2 {
    font-family: Calistoga, sans-serif;
    margin: 0;
  }

  & p {
    font-weight: 300;
  }
}

.speciality-info-wrapper {
  & h3 {
    margin: 0;
  }
  & p {
    font-weight: 300;
  }
}

.calendar-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  overflow: auto;
  gap: 16px;
}

.calendar {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.calendar-header {
  display: flex;
  gap: 32px;
  transition: gap 0.3s ease;
}
.date-wrapper {
  display: flex;
  flex-direction: column;
  min-width: 50px;
  overflow: auto;

  & h3 {
    font-family: Calistoga, sans-serif;
    margin: 0;
    text-align: center;
    overflow: auto;
  }

  & p {
    margin: 0;
    text-align: center;
  }
}

.calendar-day-header {
  flex: 1 1 0;
  overflow: auto;
}

.calendar-body {
  display: flex;
  gap: 32px;
  margin: 0;
  transition: gap 0.3s ease;
}

.calendar-day-body {
  flex: 1;
}

.slots {
  display: flex;
  flex-direction: column;
}

form {
  background-color: var(--white);
  padding: 8px;
  border-radius: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 0 20% 64px 20%;
  transition:
    padding 0.3s ease,
    margin 0.3s ease,
    border-radius 0.3s ease;
}

input[type='date'] {
  appearance: none;
  flex: 1 1 0;
  padding-right: 40px;
  background-image: url('../../assets/images/arrows/arrow-down-gray.svg');
  background-position: calc(100% - 16px) center;
  background-repeat: no-repeat;
  background-size: 24px;
  position: relative;
  font-size: 16px;
  min-width: 100px;
}

input[type='date']::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.form-as-header {
  border-radius: 0px;
  margin: 0;
  padding: 24px 64px;
}

.no-results {

  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--white);
  margin: 16px 10%;
  border-radius: 24px;
  padding: 16px 16px 10% 16px;

  & img {
    opacity: 0.8;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  & h3 {
    text-align: center;
    margin: 0;
    font-family: Calistoga, sans-serif;
    font-size: 100%;
    color: var(--purple-700);
  }
}

@media only screen and (width <= 500px) {
  

  .form-as-header {
    padding: 8px;
  }

  .calendar-header {
    gap: 4px;
    transition: gap 0.6s ease;
  }
  .calendar-body {
    gap: 4px;
    transition: gap 0.6s ease;
  }

  .arrow {
    padding: 4px;
    transition: padding 0.6s ease;
  }

  .calendar-wrapper {
    gap: 4px;
  }

}

@media only screen and (width <= 700px) {
  .info-container {
    padding-left: 8px;
  }

  .calendar-wrapper {
    gap: 8px;
  }
  .specialist-container {
    margin: 0;
    border-radius: 0;
    padding: 8px;
  }

  .calendar-body {
    gap: 4px;
    transition: gap 0.6s ease;
  }

}
</style>
