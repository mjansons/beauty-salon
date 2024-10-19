<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import {
  getUsersSpecialities,
  addSpecialityToUser,
  removeSpecialityFromUser,
  getUsersInvitations,
  acceptInvitation,
  rejectInvitation,
  getEmployerDetails,
  addSpecialistHours,
  deleteAllSpecialistHours,
  getSpecialistHours,
  getAllSpecialities,
} from '@/stores/trpcCalls'
import InfoToast from './InfoToast.vue'
import WorkingHours from '../signup/WorkingHours.vue'

const showToast = ref(false)

const employer = ref<
  | {
      email: string
      name: string
      city: string
      address: string
      phoneNumber: string
      postalCode: string
    }
  | undefined
>()
const usersSpecialities = ref<string[]>([])
const updatedSpecialities = ref<string[]>([])
const allSpecialities = ref<string[]>([])
const invitations = ref<
  {
    email: string
    name: string
    city: string
    address: string
    businessId: number
    createdAt: Date
  }[]
>([])

const defaultWorkingDays = ref<
  { dayOfWeek: number; startTime: string; endTime: string }[] | undefined
>(undefined)

const workingDays = ref<
  { dayOfWeek: number; startTime: string; endTime: string }[]
>([])

const addableSpecialities = computed(() =>
  allSpecialities.value.filter((s) => !updatedSpecialities.value.includes(s))
)
const selectedSpeciality = ref('')

onBeforeMount(async () => {
  allSpecialities.value = (await getAllSpecialities()).map((s) => s.speciality)
  usersSpecialities.value = await getUsersSpecialities()
  updatedSpecialities.value = [...usersSpecialities.value]
  invitations.value = await getUsersInvitations()
  employer.value = await getEmployerDetails()
  defaultWorkingDays.value = await getSpecialistHours()
})

const removeSpeciality = (speciality: string) => {
  updatedSpecialities.value = updatedSpecialities.value.filter(
    (s) => s !== speciality
  )
}

const addSpeciality = () => {
  updatedSpecialities.value.push(selectedSpeciality.value)
}
function handleWorkingDays(
  value: { dayOfWeek: number; startTime: string; endTime: string }[]
) {
  workingDays.value = value
}

async function saveChanges() {
  try {
    // for added specialities
    for (const speciality of updatedSpecialities.value) {
      if (!usersSpecialities.value.includes(speciality)) {
        await addSpecialityToUser({ speciality: speciality })
      }
    }

    // for removed specialities
    for (const speciality of usersSpecialities.value) {
      if (!updatedSpecialities.value.includes(speciality)) {
        await removeSpecialityFromUser({ speciality: speciality })
      }
    }

    usersSpecialities.value = [...updatedSpecialities.value]

    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 1500)
  } catch (error) {
    console.log(error)
  }
}

async function accept(businessId: number) {
  try {
    await acceptInvitation({ businessId: businessId })
    invitations.value = invitations.value.filter(
      (i) => i.businessId !== businessId
    )
  } catch (error) {
    console.log(error)
  }
}

async function reject(businessId: number) {
  try {
    await rejectInvitation({ businessId: businessId })
    invitations.value = invitations.value.filter(
      (i) => i.businessId !== businessId
    )
  } catch (error) {
    console.log(error)
  }
}

async function updateSchedule() {
  try {
    await deleteAllSpecialistHours()

    if (workingDays.value.length !== 0) {
      for (const day of workingDays.value) {
        await addSpecialistHours(day)
      }
    }
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 1500)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <InfoToast :showToast="showToast" />
  <!-- Schedule -->
  <WorkingHours
    :buttonText="'Save changes'"
    :defaultWorkingDays="defaultWorkingDays"
    :account-view="true"
    @working-days="handleWorkingDays"
    @next-step="updateSchedule"
    ><h1>Your working hours</h1></WorkingHours
  >

    <!-- Company I work for details? -->
    <div v-if="employer" class="employer-details-wrapper">
    <h1>Employer</h1>
    <div class="employer-details">
      <div class="employer-detail">
        <h4>Company</h4>
        <p>{{ employer.name }}</p>
      </div>
      <div class="employer-detail">
        <h4>City</h4>
        <p>{{ employer.city }}</p>
      </div>
      <div class="employer-detail">
        <h4>Address</h4>
        <p>{{ employer.address }}</p>
      </div>
      <div class="employer-detail">
        <h4>Phone</h4>
        <p>{{ employer.address }}</p>
      </div>
      <div class="employer-detail">
        <h4>Email</h4>
        <p>{{ employer.email }}</p>
      </div>
    </div>
  </div>
  <!-- Specialities -->
  <div class="specialities-main-wrapper">
    <h1>Specialities</h1>
    <div class="specialities-wrapper">
      <div
        class="speciality"
        v-for="speciality in updatedSpecialities"
        :key="speciality"
      >
        <h4>{{ speciality }}</h4>
        <button
          class="btn-secondary"
          type="button"
          @click="removeSpeciality(speciality)"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.17844 5.82147C7.52757 5.1706 6.47229 5.17059 5.82141 5.82146C5.17054 6.47233 5.17053 7.52761 5.8214 8.17848L9.64285 12L5.8214 15.8215C5.17053 16.4724 5.17054 17.5276 5.82141 18.1785C6.47229 18.8294 7.52757 18.8294 8.17844 18.1785L11.9999 14.357L15.8213 18.1785C16.4722 18.8294 17.5274 18.8294 18.1783 18.1785C18.8292 17.5276 18.8292 16.4724 18.1783 15.8215L14.3569 12L18.1783 8.17848C18.8292 7.52761 18.8292 6.47233 18.1783 5.82146C17.5274 5.17059 16.4722 5.1706 15.8213 5.82147L11.9999 9.64294L8.17844 5.82147Z"
              fill="#200179"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="specialities-adder" v-if="addableSpecialities.length > 0">
      <select name="prefix" v-model="selectedSpeciality">
        <option disabled value="">Select a speciality</option>
        <option
          v-for="speciality in addableSpecialities"
          :key="speciality"
          :value="speciality"
        >
          {{ speciality }}
        </option></select
      ><button
        class="btn-secondary"
        type="button"
        :disabled="selectedSpeciality === ''"
        @click="addSpeciality"
      >
        Add
      </button>
    </div>
    <button class="btn-primary" type="button" @click="saveChanges">
      Save changes
    </button>
  </div>

  <!-- Invitations -->
  <div v-if="invitations.length > 0" class="invitations-wrapper">
    <h1>Invitations</h1>
    <div
      v-for="invitation in invitations"
      :key="invitation.businessId"
      class="invitation"
    >
      <div class="invitation-details">
        <div class="invitation-detail">
          <h4>Company</h4>
          <p>{{ invitation.name }}</p>
        </div>
        <div class="invitation-detail">
          <h4>City</h4>
          <p>{{ invitation.city }}</p>
        </div>
        <div class="invitation-detail">
          <h4>Address</h4>
          <p>{{ invitation.address }}</p>
        </div>
        <div class="invitation-detail">
          <h4>Email</h4>
          <p>{{ invitation.email }}</p>
        </div>
      </div>

      <div class="invitation-buttons">
        <button
          class="btn-secondary"
          type="button"
          @click="reject(invitation.businessId)"
        >
          Decline
        </button>
        <button
          class="btn-primary"
          type="button"
          @click="accept(invitation.businessId)"
        >
          Accept
        </button>
      </div>
    </div>
  </div>


</template>

<style scoped>
.invitations-wrapper {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  background-color: var(--white);
  max-height: fit-content;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
}

.invitation {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  border: 2px dashed var(--purple-100);
  border-radius: 16px;
  padding: 16px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  & h4 {
    margin: 0;
  }
}

.invitation-details {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.invitation-buttons {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-left: auto;
}

.employer-details-wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  max-height: fit-content;
  padding: 24px;
  border-radius: 16px;
}
.specialities-main-wrapper {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  background-color: var(--white);
  max-height: fit-content;
  padding: 24px;
  border-radius: 16px;

  & .btn-primary {
    margin-left: auto;
  }
}

.specialities-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.speciality {
  display: flex;
  align-items: center;
  gap: 16px;
  align-content: center;

  & h4 {
    margin: 0;
  }
  & .btn-secondary {
    max-width: fit-content;
    padding: 8px;
  }
  & svg {
    width: 16px;
    height: 16px;
  }
  & path {
    fill: var(--purple-500);
  }
}

.specialities-adder {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: flex-start;

  & .btn-secondary{
    max-width: fit-content;
    margin-left: auto;
  }
}

h1 {
  margin-bottom: 16px;
  font-family: Calistoga, sans-serif;
}

.employer-details {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;

  & h4 {
    margin: 0;
  }
}
</style>
