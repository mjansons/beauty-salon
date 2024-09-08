<script lang="ts" setup>
import { ref } from 'vue'
import BusinessOrClient from '@/components/signup/BusinessOrClient.vue'
import AccountType from '@/components/signup/AccountType.vue'
import AdditionalUserDetails from '@/components/signup/AdditionalUserDetails.vue'
import SpecialistServices from '@/components/signup/SpecialistServices.vue'
import useBusinessStore from '@/stores/businessStore'
import { watch } from 'vue'
import { trpc } from '@/trpc'

const businessStore = useBusinessStore()

const onBoardingStep = ref(1)
const isClientAccount = ref(true)
const isSpecialistAccount = ref(true)

watch(onBoardingStep, async (newVal) => {
  // finish specialist onboarding
  if (newVal === 5 && isSpecialistAccount.value === true) {
    // add spicalist role to the user
    await trpc.user.addRoleToUser.mutate({
      role: 'specialist',
    })
    // add specialities to the user
    if (
      businessStore.userSpecialities &&
      businessStore.userSpecialities.length !== 0
    ) {
      for (const speciality of businessStore.userSpecialities) {
        await trpc.user.addSpecialityToUser.mutate({
          speciality,
        })
      }
    }
    // mark onboarding as complete
    await trpc.user.updateUserDetails.mutate({
      isOnboarded: true,
    })
    console.log('Onboarding complete')
  }
})
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

  <AdditionalUserDetails
    v-if="
      (onBoardingStep === 2 && isClientAccount) ||
      (onBoardingStep === 4 && isSpecialistAccount)
    "
    @next-step="() => onBoardingStep++"
  ></AdditionalUserDetails>

  <SpecialistServices
    v-if="onBoardingStep === 3 && isSpecialistAccount"
    @next-step="onBoardingStep++"
  ></SpecialistServices>
</template>

<style scoped></style>
