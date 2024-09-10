<script lang="ts" setup>
import { ref, reactive } from 'vue'
import BusinessOrClient from '@/components/signup/BusinessOrClient.vue'
import AccountType from '@/components/signup/AccountType.vue'
import AdditionalUserDetails from '@/components/signup/AdditionalUserDetails.vue'
import Services from '@/components/signup/Services.vue'
import BusinessDetails from '@/components/signup/BusinessDetails.vue'
import BusinessHours from '@/components/signup/WorkingHours.vue'
import OnboardingSuccess from '@/components/signup/OnboardingSuccess.vue'
import { watch } from 'vue'
import { trpc } from '@/trpc'

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

watch(onBoardingStep, async (newVal) => {
  // finish client onboarding
  if (newVal === 4 && isClientAccount.value === true) {
    // mark onboarding as complete for client
    await trpc.user.updateUserDetails.mutate(userDetails.value)
  }

  // finish specialist onboarding
  if (newVal === 7 && isSpecialistAccount.value === true) {
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
      alert("message")
      for (const day of workingHours.value) {
        await trpc.user.addSpecialistHours.mutate(day)
      }
    }
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
    await trpc.user.updateUserDetails.mutate({
      isOnboarded: true,
    })
  }
})
</script>

<template>
  <p>{{ userDetails }}</p>
  <p>{{ services }}</p>
  <p>{{ onBoardingStep }}</p>
  <p>{{ workingHours }}</p>
  <p>{{ businessDetails }}</p>
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
      (onBoardingStep === 5 && isSpecialistAccount)
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
    v-if="onBoardingStep === 4"
    @next-step="() => onBoardingStep++"
    @working-hours="(value) => (workingHours = value)"
  ></BusinessHours>

  <OnboardingSuccess
    v-if="(onBoardingStep === 3 && isClientAccount) || onBoardingStep === 6"
    @next-step="() => onBoardingStep++"
  ></OnboardingSuccess>
</template>

<style scoped></style>
