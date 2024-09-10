<script lang="ts" setup>
import { reactive, computed } from 'vue'

const workingHours = reactive([
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
])

const emit = defineEmits(['nextStep', 'workingHours'])

const isFormValid = computed(() => {
  return workingHours.every((day) => {
    if (day.isOperational) {
      return day.startTime && day.endTime
    }
    return true
  })
})

const emitDetails = async () => {
  const parsedBusinessHours = workingHours
    .filter((day) => day.isOperational)
    .map((day) => {
      return {
        dayOfWeek: day.dayOfWeek,
        startTime: `${day.startTime}:00`,
        endTime: `${day.endTime}:00`,
      }
    })

  emit('workingHours', parsedBusinessHours)
  emit('nextStep')
}
</script>

<template>
  <h1>Your working hours</h1>
  <form @submit.prevent="emitDetails">
    <div v-for="day in workingHours" :key="day.name" class="day-container">
      <div class="check-container">
        <input
          type="checkbox"
          v-model="day.isOperational"
          :id="day + '-operational'"
        />
        <label :for="day.name">{{ day.name }}</label>
      </div>
      <div class="time-container">
        <input
          v-model="day.startTime"
          :id="day + '-open'"
          type="time"
          placeholder="Open"
        />
        <p>-</p>
        <input
          v-model="day.endTime"
          :id="day + '-close'"
          type="time"
          placeholder="Close"
        />
      </div>
    </div>
    <button type="submit" :disabled="!isFormValid">Continue</button>
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
</style>
