<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import {
  getUsersSpecialities,
  addSpecialityToUser,
  removeSpecialityFromUser,
  getUsersInvitations,
  acceptInvitation,
  rejectInvitation,
} from '@/stores/trpcCalls'
import { getAllSpecialities } from '@/stores/trpcCalls'
import InfoToast from './InfoToast.vue'

const showToast = ref(false)
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
const addableSpecialities = computed(() =>
  allSpecialities.value.filter((s) => !updatedSpecialities.value.includes(s))
)
const selectedSpeciality = ref('')

onBeforeMount(async () => {
  allSpecialities.value = (await getAllSpecialities()).map((s) => s.speciality)
  usersSpecialities.value = await getUsersSpecialities()
  updatedSpecialities.value = [...usersSpecialities.value]
  invitations.value = await getUsersInvitations()
})

const removeSpeciality = (speciality: string) => {
  updatedSpecialities.value = updatedSpecialities.value.filter(
    (s) => s !== speciality
  )
}

const addSpeciality = () => {
  updatedSpecialities.value.push(selectedSpeciality.value)
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
  } catch (error) {}
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
</script>

<template>
  <InfoToast :showToast="showToast" />
  <h1>Specialist Details</h1>
  <!-- Specialities -->
  <p>Specialities:</p>
  <div
    class="speciality"
    v-for="speciality in updatedSpecialities"
    :key="speciality"
  >
    <p>{{ speciality }}</p>
    <button type="button" @click="removeSpeciality(speciality)">x</button>
  </div>

  <div v-if="addableSpecialities.length > 0">
    <select name="prefix" v-model="selectedSpeciality">
      <option disabled value="">Select a speciality</option>
      <option v-for="speciality in addableSpecialities" :value="speciality">
        {{ speciality }}
      </option></select
    ><button
      type="button"
      :disabled="selectedSpeciality === ''"
      @click="addSpeciality"
    >
      Add
    </button>
  </div>

  <!-- Invitations -->
  <button type="button" @click="saveChanges">Save changes</button>
  <div v-if="invitations.length > 0" class="invitations">
    <p>Invitations:</p>
    <div v-for="invitation in invitations" :key="invitation.businessId">
      <p>{{ invitation.name }}</p>
      <p>{{ invitation.city }}</p>
      <p>{{ invitation.address }}</p>
      <p>{{ invitation.email }}</p>
      <button type="button" @click="accept(invitation.businessId)">
        Accept
      </button>
      <button type="button" @click="reject(invitation.businessId)">
        Decline
      </button>
    </div>
  </div>

  <!-- Appointments -->
  <p>Appointments:</p>

  <!-- Company I work for details? -->
  <!-- Schedule -->
</template>

<style scoped>
.speciality {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}
</style>
