<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps<{
  defaultWorkingDays?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
  buttonText?: string
  accountView?: boolean
}>()

const emit = defineEmits(['nextStep', 'workingDays', 'previousStep'])

const emitPreviousStep = () => {
  emit('previousStep')
}

export interface WorkingDay {
  isOperational: boolean
  startTime: string
  endTime: string
  dayOfWeek: number
  name: string
}

const buttonText = computed(() => {
  return props.buttonText ? props.buttonText : 'Continue'
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
  <div :class="{ background: !props.accountView }">
    <div
      :class="
        props.accountView ? 'account-view-modal-wrapper' : 'modal-wrapper'
      "
    >
      <div v-if="!props.accountView" class="back-button-wrapper">
        <div class="back-button" @click="emitPreviousStep">
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
              fill="#6C38FF"
            />
          </svg>

          <p>Back</p>
        </div>
      </div>
      <slot>
        <h1>Your working hours</h1>
      </slot>
      <p class="disclaimer" v-if="!props.accountView">
        By signing up you agree to Winks’ Privacy Policy & Terms of Service
      </p>

      <form @submit.prevent="emitDetails">
        <div
          v-for="day in workingDays"
          :key="day.name"
          class="day-container"
          :class="{ 'last-day': day.dayOfWeek === 0 }"
        >
          <div
            class="check-container"
            @click="day.isOperational = !day.isOperational"
          >
            <div
              :id="day.name + '-operational'"
              :class="day.isOperational ? 'checked' : 'unchecked'"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                v-if="day.isOperational"
              >
                <path
                  d="M10.5 3L5 8.5L2.5 6"
                  stroke="#3604C4"
                  stroke-width="1.6666"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
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
            <p>—</p>
            <input
              v-model="day.endTime"
              :id="day.name + '-close'"
              type="time"
              placeholder="Close"
              :disabled="!day.isOperational"
            />
          </div>
        </div>
        <div class="button-wrapper">
          <button class="btn-primary" type="submit" :disabled="!isFormValid">
            {{ buttonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: Calistoga, sans-serif;
  margin-bottom: 16px;
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray);
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
}

.modal-wrapper {
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  width: 550px;
  overflow: auto;
  box-sizing: border-box;
}

.account-view-modal-wrapper {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--white);
  max-width: 400px;
}

.day-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--gray);
}

.check-container {
  padding-right: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
}

.time-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  & input {
    max-width: 70px;
  }
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  margin-top: 32px;
  margin-left: auto;
  white-space: nowrap;
}

.disclaimer {
  font-size: var(--small);
  color: var(--gray-500);
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;
  text-align: left;
}

.last-day {
  border-bottom: none;
  margin-bottom: 0;
}

label {
  color: var(--gray-500);
  cursor: pointer;
}

@media (width <= 550px) {
  .day-container {
    margin-right: 15%;
  }

  .check-container {
    padding-bottom: 8px;
  }
}

@media (width <= 410px) {
  .day-container {
    margin-right: 10%;
  }
}
</style>
