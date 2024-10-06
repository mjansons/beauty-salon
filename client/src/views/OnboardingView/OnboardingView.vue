<script lang="ts" setup>
import { ref } from 'vue'
import BusinessOrClient from '@/components/signup/BusinessOrClient.vue'
import AccountType from '@/components/signup/AccountType.vue'
import AdditionalUserDetails from '@/components/signup/AdditionalUserDetails.vue'
import Services from '@/components/signup/Services.vue'
import BusinessDetails from '@/components/signup/BusinessDetails.vue'
import BusinessHours from '@/components/signup/WorkingHours.vue'
import OnboardingSuccess from '@/components/signup/OnboardingSuccess.vue'
import { watch } from 'vue'
import { trpc } from '@/trpc'
import { logout } from '@/stores/user'
import router from '@/router'

const onBoardingStep = ref(1)
const isClientAccount = ref(null)
const isSpecialistAccount = ref(false)
const businessDetails = ref({
  name: '',
  address: '',
  city: '',
  postalCode: '',
  email: '',
  phoneNumber: '',
})
const userDetails = ref({
  phoneNumber: '',
  firstName: '',
  lastName: '',
  isOnboarded: true,
})
const workingHours = ref<
  { dayOfWeek: number; startTime: string; endTime: string }[]
>([])
const services = ref<string[]>([])

watch(onBoardingStep, async (newVal, oldValue) => {
  if (oldValue === 2 && newVal === 1) {
    isSpecialistAccount.value = false
  }

  // finish client onboarding
  if (newVal === 3 && isClientAccount.value === true) {
    // mark onboarding as complete for client
    await trpc.user.updateUserDetails.mutate(userDetails.value)
  }
  if (newVal === 4 && isClientAccount.value === true) {
    logout()
    router.push({ name: 'login' })
  }

  // finish specialist onboarding
  if (newVal === 6 && isSpecialistAccount.value === true) {
    // add spicalist role to the user
    await trpc.user.addRoleToUser.mutate({
      role: 'specialist',
    })
    // add specialities to the user
    if (services.value.length !== 0) {
      for (const speciality of services.value) {
        await trpc.user.addSpecialityToUser.mutate({
          speciality,
        })
      }
    }
    // add specialist working hours
    if (workingHours.value.length !== 0) {
      for (const day of workingHours.value) {
        await trpc.user.addSpecialistHours.mutate(day)
      }
    }
    await trpc.user.updateUserDetails.mutate(userDetails.value)
  }

  if (newVal === 7 && isSpecialistAccount.value === true) {
    logout()
    router.push({ name: 'login' })
  }

  // finish business owner onboarding
  if (newVal === 7 && isSpecialistAccount.value === false) {
    // register the business with business details / user role automatically will be updated
    const businessCreated = await trpc.business.addBusiness.mutate(
      businessDetails.value
    )
    // add business specialities
    if (services.value.length !== 0) {
      for (const speciality of services.value) {
        await trpc.business.addBusinessSpeciality.mutate({
          businessId: businessCreated.id,
          specialityName: speciality,
          price: 1,
        })
      }
    }

    // add business working hours
    if (workingHours.value.length !== 0) {
      for (const day of workingHours.value) {
        await trpc.business.addBusinessHours.mutate({
          businessId: businessCreated.id,
          ...day,
        })
      }
    }

    // mark onboarding as complete for business owner
    await trpc.user.updateUserDetails.mutate(userDetails.value)
  }

  if (newVal === 8 && isSpecialistAccount.value === false) {
    logout()
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <button
    type="button"
    v-if="
      onBoardingStep > 1 &&
      !(onBoardingStep === 3 && isClientAccount) &&
      onBoardingStep !== 7 &&
      !(onBoardingStep === 6 && isSpecialistAccount)
    "
    @click="onBoardingStep--"
  >
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
      (onBoardingStep === 5 && isSpecialistAccount) ||
      (onBoardingStep === 6 && !isSpecialistAccount)
    "
    @next-step="() => onBoardingStep++"
    @user-details="(value) => (userDetails = value)"
  ></AdditionalUserDetails>

  <Services
    v-if="
      (onBoardingStep === 3 && isSpecialistAccount) ||
      (onBoardingStep === 5 && !isSpecialistAccount)
    "
    @next-step="onBoardingStep++"
    @services="(value) => (services = value)"
  ></Services>

  <BusinessDetails
    v-if="onBoardingStep === 3 && !isSpecialistAccount && !isClientAccount"
    @next-step="() => onBoardingStep++"
    @business-details="(value) => (businessDetails = value)"
  ></BusinessDetails>

  <BusinessHours
    v-if="onBoardingStep === 4 && !isClientAccount"
    @next-step="() => onBoardingStep++"
    @working-days="(value) => (workingHours = value)"
  ></BusinessHours>

  <OnboardingSuccess
    v-if="
      (onBoardingStep === 3 && isClientAccount) ||
      onBoardingStep === 7 ||
      (onBoardingStep === 6 && isSpecialistAccount)
    "
    @next-step="() => onBoardingStep++"
  ></OnboardingSuccess>
</template>

<!-- <style scoped></style> -->
