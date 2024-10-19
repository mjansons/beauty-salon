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
  updatedEmployees.value = updatedEmployees.value.filter(
    (employee) => employee.email !== email
  )
}
</script>

<template>
  <InfoToast :showToast="showToast" :buttonText="'Changes saved!'" />
  <form @submit.prevent="saveChanges">
    <h3>Employees</h3>
    <p v-if="updatedEmployees.length === 0">No employees yet!</p>
    <div class="employee-wrapper">
      <div class="employee" v-for="employee in updatedEmployees" :key="employee.email">
        <p>
          {{ employee.firstName }}, {{ employee.lastName }}, {{ employee.email }},
          {{ employee.phoneNumber }}
        </p>
        <button class="btn-secondary" type="button" @click="fireEmployee(employee.email)">Delete</button>
      </div>
    </div>

    <button class="btn-primary" type="submit" v-if="employees.length > 0">Save Changes</button>
  </form>
</template>

<style scoped>
h3 {
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: Calistoga, sans-serif;
}

form {
  display: flex;
  flex: 1 1 0;
  border: 2px dashed var(--purple-100);
  padding: 24px;
  flex-direction: column;
  background-color: var(--white);
  border-radius: 16px;
  justify-content: flex-start;
  max-height: fit-content;
  width: 100%;
}
.employee-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: flex-start;
}

.employee {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  gap: 16px;
  justify-content: space-between;
  border: 2px dashed var(--purple-100);
  padding: 16px;
  border-radius: 16px;
  overflow: auto;

   & p {
    display: flex;
    flex: 3;
   }
}

.btn-primary {
  margin-top: 32px;
  margin-left: auto;
  max-height: fit-content;
}

.btn-secondary {
  margin-left: auto;
  max-width: fit-content;
  flex: 0 0 auto;
}

</style>
