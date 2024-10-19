<script setup lang="ts">
import HeaderAuth from '@/components/headers/HeaderAuth.vue'
import OwnerAccountDetails from '@/components/account/OwnerAccountDetails.vue'
import SpecialistAccountDetails from '@/components/account/SpecialistAccountDetails.vue'
import PersonalAccountDetails from '@/components/account/PersonalAccountDetails.vue'
import FooterElement from '@/components/FooterElement.vue'
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

  <RouterLink class="back-button-wrapper" :to="{ name: 'home' }" tabindex="-1">
    <div class="back-button">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#3604C4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.6536 16.4928C11.3814 16.8051 10.9076 16.8375 10.5954 16.5653L6.00715 12.5653C5.84377 12.4229 5.75 12.2167 5.75 12C5.75 11.7832 5.84377 11.5771 6.00715 11.4347L10.5954 7.43466C10.9076 7.16247 11.3814 7.19491 11.6536 7.50714C11.9258 7.81936 11.8933 8.29312 11.5811 8.56532L8.50161 11.25L17.5 11.25C17.9142 11.25 18.25 11.5858 18.25 12C18.25 12.4142 17.9142 12.75 17.5 12.75L8.50161 12.75L11.5811 15.4347C11.8933 15.7069 11.9258 16.1806 11.6536 16.4928Z"
          fill="#3604C4"
        />
      </svg>
      <p>Return</p>
    </div>
  </RouterLink>
  <div class="account-details-wrapper">
    <PersonalAccountDetails></PersonalAccountDetails>
    <SpecialistAccountDetails
      v-if="userRoles.includes('specialist')"
    ></SpecialistAccountDetails>
    <OwnerAccountDetails
      v-if="userRoles.includes('owner')"
    ></OwnerAccountDetails>
  </div>
  <div class="button-wrapper">
    <button class="btn-secondary" type="button" @click="logoutUser">
      Logout
    </button>
  </div>
  <FooterElement></FooterElement>
</template>

<style scoped>
.back-button {
  display: flex;
  justify-content: flex-start;
  margin-top: 32px;
  margin-left: 32px;
}
.account-details-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  padding: 32px;
  width: 100%;
  box-sizing: border-box;
}

.button-wrapper {
  margin: 0 auto;
  margin-bottom: 32px;
}

@media screen and (width <= 400px) {
  .account-details-wrapper {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>
