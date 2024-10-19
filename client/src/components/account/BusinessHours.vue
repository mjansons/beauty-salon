<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import WorkingHours from '../signup/WorkingHours.vue'
import InfoToast from './InfoToast.vue'
import {
  addBusinessHoursToDay,
  deleteAllBusinessHours,
  getAllBusinessHours,
} from '@/stores/trpcCalls'

const props = defineProps<{
  businessId: number
}>()

const showToast = ref(false)

const defaultWorkingDays = ref<
  { dayOfWeek: number; startTime: string; endTime: string, businessId: number }[] | undefined
>(undefined)

const workingDays = ref<
  { dayOfWeek: number; startTime: string; endTime: string }[]
>([])

function handleWorkingDays(
  value: { dayOfWeek: number; startTime: string; endTime: string }[]
) {
  workingDays.value = value
}

async function updateSchedule() {
  try {
    await deleteAllBusinessHours({
    businessId: props.businessId
})

    if (workingDays.value.length !== 0) {
      for (const day of workingDays.value) {
        await addBusinessHoursToDay({...day, businessId: props.businessId})
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

onBeforeMount(async () => {
  defaultWorkingDays.value = await getAllBusinessHours({
    businessId: props.businessId,
  })
})

</script>

<template>
  <InfoToast :showToast="showToast" />
  <WorkingHours
    :buttonText="'Save changes'"
    :defaultWorkingDays="defaultWorkingDays"
    :account-view="true"
    @working-days="handleWorkingDays"
    @next-step="updateSchedule"
    class="work-hours"
  ><h3>Business operational hours</h3></WorkingHours>
</template>

<style scoped>

h3 {
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: Calistoga, sans-serif;
}

.work-hours {
  border: 2px dashed var(--purple-100);
  border-radius: 16px;
}

</style>
