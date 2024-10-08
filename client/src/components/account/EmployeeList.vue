<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import InfoToast from './InfoToast.vue'
import { getEmployees, deleteEmployee } from '@/stores/trpcCalls'

const props = defineProps<{
  businessId: number
}>()

const employees = ref<
  {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
  }[]
>([])

const updatedEmployees = ref<
  {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
  }[]
>([])
onBeforeMount(async () => {
  employees.value = await getEmployees({ businessId: props.businessId })
  updatedEmployees.value = [...employees.value]
})

const showToast = ref(false)

const saveChanges = async () => {
  // filter out employees to be deleted
  employees.value = employees.value.filter(async (employee) => {
    if (updatedEmployees.value.find((updatedEmployee) => updatedEmployee.email === employee.email)) {
      return true
    } else {
      await deleteEmployee({
        businessId: props.businessId,
        employeeEmail: employee.email,
      })
      return false
    }
  })

  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 1500)
}

const fireEmployee = async (email: string) => {
  updatedEmployees.value = employees.value.filter(
    (employee) => employee.email !== email
  )
}
</script>

<template>
  <InfoToast :showToast="showToast" :buttonText="'Changes saved!'" />
  <form @submit.prevent="saveChanges">
    <p>Employees:</p>
    <p v-if="updatedEmployees.length === 0">No employees yet!</p>
    <div v-for="employee in updatedEmployees" :key="employee.email">
      <p>
        {{ employee.firstName }} {{ employee.lastName }} {{ employee.email }}
        {{ employee.phoneNumber }}
      </p>
      <button type="button" @click="fireEmployee(employee.email)">Delete Employee</button>
    </div>

    <button type="submit">Save Changes</button>
  </form>
</template>

<style scoped>

</style>
