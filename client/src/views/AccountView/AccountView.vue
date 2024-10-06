<script setup lang="ts">
import HeaderAuth from '@/components/headers/HeaderAuth.vue'
// import OwnerAccountDetails from '@/components/account/OwnerAccountDetails.vue'
import SpecialistAccountDetails from '@/components/account/SpecialistAccountDetails.vue'
import PersonalAccountDetails from '@/components/account/PersonalAccountDetails.vue'
import { logout } from '@/stores/user'
import router from '@/router'
import { onBeforeMount, ref } from 'vue'
import { getUserRoles } from '@/stores/trpcCalls'

const userRoles = ref<string[]>([])

onBeforeMount(async () => {
  userRoles.value = await getUserRoles()
})

const logoutUser = () => {
  logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <HeaderAuth></HeaderAuth>
  <PersonalAccountDetails></PersonalAccountDetails>
  <SpecialistAccountDetails
    v-if="userRoles.includes('specialist')"
  ></SpecialistAccountDetails>
  <!-- <OwnerAccountDetails v-if="userRoles.includes('owner')"></OwnerAccountDetails> -->
  <button type="button" @click="logoutUser">Logout</button>
</template>

<!-- <style scoped></style> -->
