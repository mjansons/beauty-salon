<script lang="ts" setup>
import { ref } from 'vue'
import BusinessOrClient from '@/components/signup/BusinessOrClient.vue'
import AccountType from '@/components/signup/AccountType.vue'
import AdditionalUserDetails from '@/components/signup/AdditionalUserDetails.vue'
import SpecialistServices from '@/components/signup/SpecialistServices.vue'

const onBoardingStep = ref(1)
const isClientAccount = ref(true)
const isSpecialistAccount = ref(true)
</script>

<template>
  <p>{{ `Onboarding step: ${onBoardingStep}` }}</p>
  <p>{{ `isClientAccount: ${isClientAccount}` }}</p>
  <p>{{ `isSpecialistAccount: ${isSpecialistAccount}` }}</p>
  <RouterLink :to="{ name: 'home' }" tabindex="-1"
    ><button type="button" v-if="onBoardingStep === 1">Return</button>
  </RouterLink>
  <button type="button" v-if="onBoardingStep > 1" @click="onBoardingStep--">
    Back
  </button>

  <BusinessOrClient
    v-if="onBoardingStep === 1"
    @is-client-account="(value) => (isClientAccount = value)"
    @next-step="() => onBoardingStep++"
  ></BusinessOrClient>

  <AccountType
    v-if="onBoardingStep === 2 && !isClientAccount"
    @is-specialist-account="(value) => (isSpecialistAccount = value)"
    @next-step="() => onBoardingStep++"
  ></AccountType>

  <AdditionalUserDetails v-if="onBoardingStep === 2 && isClientAccount"
    ><</AdditionalUserDetails
  >

  <SpecialistServices v-if="onBoardingStep === 3 && isSpecialistAccount"></SpecialistServices>
</template>

<style scoped></style>
