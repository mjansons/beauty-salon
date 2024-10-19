<script lang="ts" setup>
import { ref, watch } from 'vue';
import BusinessOrClient from '@/components/signup/BusinessOrClient.vue';
import AccountType from '@/components/signup/AccountType.vue';
import AdditionalUserDetails from '@/components/signup/AdditionalUserDetails.vue';
import Services from '@/components/signup/Services.vue';
import BusinessDetails from '@/components/signup/BusinessDetails.vue';
import BusinessHours from '@/components/signup/WorkingHours.vue';
import OnboardingSuccess from '@/components/signup/OnboardingSuccess.vue';
import { trpc } from '@/trpc';
import { logout } from '@/stores/user';
import router from '@/router';

const callsSucceeded = ref(false);
const onBoardingStep = ref(1);
const isClientAccount = ref(null);
const isSpecialistAccount = ref(false);
const businessDetails = ref({
  name: '',
  address: '',
  city: '',
  postalCode: '',
  email: '',
  phoneNumber: '',
});
const userDetails = ref({
  phoneNumber: '',
  firstName: '',
  lastName: '',
  isOnboarded: true,
});
const workingHours = ref<
  { dayOfWeek: number; startTime: string; endTime: string }[]
>([]);
const services = ref<string[]>([]);

watch(onBoardingStep, async (newVal, oldValue) => {
  if (oldValue === 2 && newVal === 1) {
    isSpecialistAccount.value = false;
  }

  // Reset callsSucceeded when entering a step where TRPC calls are made
  if (
    (newVal === 3 && isClientAccount.value === true) ||
    (newVal === 6 && isSpecialistAccount.value === true) ||
    (newVal === 7 && isSpecialistAccount.value === false)
  ) {
    callsSucceeded.value = false;
  }

  // Finish client onboarding
  if (newVal === 3 && isClientAccount.value === true) {
    try {
      // Mark onboarding as complete for client
      await trpc.user.updateUserDetails.mutate(userDetails.value);
      callsSucceeded.value = true;
    } catch (error) {
      console.error('Error updating user details:', error);
      // Optionally display an error message to the user
    }
  }
  if (newVal === 4 && isClientAccount.value === true && callsSucceeded.value) {
    logout();
    router.push({ name: 'login' });
  }

  // Finish specialist onboarding
  if (newVal === 6 && isSpecialistAccount.value === true) {
    try {
      // Add specialist role to the user
      await trpc.user.addRoleToUser.mutate({ role: 'specialist' });

      // Add specialities to the user
      if (services.value.length !== 0) {
        for (const speciality of services.value) {
          await trpc.user.addSpecialityToUser.mutate({ speciality });
        }
      }

      // Add specialist working hours
      if (workingHours.value.length !== 0) {
        for (const day of workingHours.value) {
          await trpc.user.addSpecialistHours.mutate(day);
        }
      }

      // Update user details
      await trpc.user.updateUserDetails.mutate(userDetails.value);
      callsSucceeded.value = true;
    } catch (error) {
      console.error('Error in specialist onboarding:', error);
      // Optionally display an error message
    }
  }

  if (newVal === 7 && isSpecialistAccount.value === true && callsSucceeded.value) {
    logout();
    router.push({ name: 'login' });
  }

  // Finish business owner onboarding
  if (newVal === 7 && isSpecialistAccount.value === false) {
    try {
      // Register the business with business details
      const businessCreated = await trpc.business.addBusiness.mutate(
        businessDetails.value
      );

      // Add business specialities
      if (services.value.length !== 0) {
        for (const speciality of services.value) {
          await trpc.business.addBusinessSpeciality.mutate({
            businessId: businessCreated.id,
            specialityName: speciality,
            price: 1,
          });
        }
      }

      // Add business working hours
      if (workingHours.value.length !== 0) {
        for (const day of workingHours.value) {
          await trpc.business.addBusinessHours.mutate({
            businessId: businessCreated.id,
            ...day,
          });
        }
      }

      // Mark onboarding as complete for business owner
      await trpc.user.updateUserDetails.mutate(userDetails.value);
      callsSucceeded.value = true;
    } catch (error) {
      console.error('Error in business owner onboarding:', error);
      // Optionally display an error message
    }
  }

  if (newVal === 8 && isSpecialistAccount.value === false && callsSucceeded.value) {
    logout();
    router.push({ name: 'login' });
  }
});
</script>

<template>
  <BusinessOrClient
    v-if="onBoardingStep === 1"
    @is-client-account="(value) => (isClientAccount = value)"
    @next-step="() => onBoardingStep++"
  ></BusinessOrClient>

  <AccountType
    v-if="onBoardingStep === 2 && !isClientAccount"
    @is-specialist-account="(value) => (isSpecialistAccount = value)"
    @next-step="() => onBoardingStep++"
    @previous-step="() => onBoardingStep--"
  ></AccountType>

  <AdditionalUserDetails
    v-if="
      (onBoardingStep === 2 && isClientAccount) ||
      (onBoardingStep === 5 && isSpecialistAccount) ||
      (onBoardingStep === 6 && !isSpecialistAccount)
    "
    @next-step="() => onBoardingStep++"
    @user-details="(value) => (userDetails = value)"
    @previous-step="() => onBoardingStep--"
  ></AdditionalUserDetails>

  <Services
    v-if="
      (onBoardingStep === 3 && isSpecialistAccount) ||
      (onBoardingStep === 5 && !isSpecialistAccount)
    "
    @next-step="() => onBoardingStep++"
    @services="(value) => (services = value)"
    @previous-step="() => onBoardingStep--"
  ></Services>

  <BusinessDetails
    v-if="onBoardingStep === 3 && !isSpecialistAccount && !isClientAccount"
    @next-step="() => onBoardingStep++"
    @business-details="(value) => (businessDetails = value)"
    @previous-step="() => onBoardingStep--"
  ></BusinessDetails>

  <BusinessHours
    v-if="onBoardingStep === 4 && !isClientAccount"
    @next-step="() => onBoardingStep++"
    @working-days="(value) => (workingHours = value)"
    @previous-step="() => onBoardingStep--"
  ></BusinessHours>

  <OnboardingSuccess
    v-if="
      callsSucceeded &&
      (
        (onBoardingStep === 3 && isClientAccount) ||
        (onBoardingStep === 7 && !isSpecialistAccount) ||
        (onBoardingStep === 6 && isSpecialistAccount)
      )
    "
    @next-step="() => onBoardingStep++"
  ></OnboardingSuccess>
</template>
