<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'

// Define the WorkingDay interface
export interface WorkingDay {
  isOperational: boolean
  startTime: string
  endTime: string
  dayOfWeek: number
  name: string
}

const props = defineProps<{
  defaultWorkingDays?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
}>()

const buttonText = computed(() => {
  return props.defaultWorkingDays ? 'Save changes' : 'Continue'
})

const defaultDays: WorkingDay[] = [
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 1,
    name: 'Monday',
  },
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 2,
    name: 'Tuesday',
  },
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 3,
    name: 'Wednesday',
  },
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 4,
    name: 'Thursday',
  },
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 5,
    name: 'Friday',
  },
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 6,
    name: 'Saturday',
  },
  {
    isOperational: false,
    startTime: '',
    endTime: '',
    dayOfWeek: 0,
    name: 'Sunday',
  },
]

function initializeWorkingDays() {
  const workingDays = defaultDays.map((defaultDay) => {
    const matchingDay = props.defaultWorkingDays?.find(
      (day) => day.dayOfWeek === defaultDay.dayOfWeek
    )

    if (matchingDay) {
      return {
        ...defaultDay,
        isOperational: true,
        startTime: matchingDay.startTime.slice(0, 5), // Ensure time format hh:mm
        endTime: matchingDay.endTime.slice(0, 5),
      }
    }

    return defaultDay
  })

  return reactive(workingDays)
}

// Watch for changes in defaultWorkingDays prop and update workingDays accordingly
watch(
  () => props.defaultWorkingDays,
  (newVal) => {
    if (newVal) {
      newVal.forEach((day) => {
        const index = workingDays.findIndex(
          (wd) => wd.dayOfWeek === day.dayOfWeek
        )
        if (index !== -1) {
          workingDays[index].isOperational = true
          workingDays[index].startTime = day.startTime.slice(0, 5)
          workingDays[index].endTime = day.endTime.slice(0, 5)
        }
      })
    }
  },
  { immediate: true }
)
const workingDays = initializeWorkingDays()

const emit = defineEmits(['nextStep', 'workingDays'])

const isFormValid = computed(() => {
  return workingDays.every((day) => {
    if (day.isOperational) {
      return day.startTime && day.endTime
    }
    return true
  })
})

const emitDetails = () => {
  const parsedBusinessHours = workingDays
    .filter((day) => day.isOperational)
    .map((day) => {
      return {
        dayOfWeek: day.dayOfWeek,
        startTime: `${day.startTime}:00`,
        endTime: `${day.endTime}:00`,
      }
    })

  emit('workingDays', parsedBusinessHours)
  emit('nextStep')
}
</script>

<template>
  <h1>Your working hours</h1>
  <form @submit.prevent="emitDetails">
    <div v-for="day in workingDays" :key="day.name" class="day-container">
      <div class="check-container">
        <input
          type="checkbox"
          v-model="day.isOperational"
          :id="day.name + '-operational'"
        />
        <label :for="day.name">{{ day.name }}</label>
      </div>
      <div class="time-container">
        <input
          v-model="day.startTime"
          :id="day.name + '-open'"
          type="time"
          placeholder="Open"
          :disabled="!day.isOperational"
        />
        <p>-</p>
        <input
          v-model="day.endTime"
          :id="day.name + '-close'"
          type="time"
          placeholder="Close"
          :disabled="!day.isOperational"
        />
      </div>
    </div>
    <button type="submit" :disabled="!isFormValid">{{ buttonText }}</button>
  </form>
</template>

<style scoped>
.day-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
}

.check-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

button {
  margin-top: 20px;
}
</style>
