<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import InfoToast from './InfoToast.vue'
import {
  getAllSpecialities,
  getBusinessSpecialities,
  deleteBusinessSpeciality,
  addBusinessSpeciality,
} from '@/stores/trpcCalls'

const props = defineProps<{
  businessId: number
}>()

const showToast = ref(false)
const allSpecialities = ref<string[]>([])

// Business specialities from the backend
const businessSpecialities = ref<
  {
    price: number
    speciality: string
    businessId: number
  }[]
>([])

// Adjusted business specialities that can be modified in the UI
const adjustedBusinessSpecialities = ref<
  {
    price: number
    speciality: string
    businessId: number
  }[]
>([])

const availableSpecialities = computed(() =>
  allSpecialities.value.filter(
    (s) => !adjustedBusinessSpecialities.value.some((bs) => bs.speciality === s)
  )
)

const selectedSpeciality = ref('')
const selectedPrice = ref<number | undefined>(undefined)

onBeforeMount(async () => {
  businessSpecialities.value = await getBusinessSpecialities({
    businessId: props.businessId,
  })
  // deep copy
  adjustedBusinessSpecialities.value = businessSpecialities.value.map((s) => ({
    ...s,
  }))
  allSpecialities.value = (await getAllSpecialities()).map((s) => s.speciality)
})

const addSpeciality = () => {
  adjustedBusinessSpecialities.value.push({
    speciality: selectedSpeciality.value,
    price: selectedPrice.value ?? 0,
    businessId: props.businessId,
  })
  selectedSpeciality.value = ''
  selectedPrice.value = undefined
}

const removeSpeciality = (index: number) => {
  adjustedBusinessSpecialities.value.splice(index, 1)
}

const saveChanges = async () => {
  const originalSpecialities = businessSpecialities.value
  const updatedSpecialities = adjustedBusinessSpecialities.value

  const originalMap = new Map(
    originalSpecialities.map((s) => [s.speciality, s])
  )
  const updatedMap = new Map(updatedSpecialities.map((s) => [s.speciality, s]))

  //  specialities that were added
  const addedSpecialities = updatedSpecialities.filter(
    (s) => !originalMap.has(s.speciality)
  )

  //  specialities that were deleted
  const deletedSpecialities = originalSpecialities.filter(
    (s) => !updatedMap.has(s.speciality)
  )

  //  specialities that were modified (price changed)
  const modifiedSpecialities = updatedSpecialities.filter((s) => {
    const original = originalMap.get(s.speciality)
    return original && original.price !== s.price
  })

  // Add new specialities
  for (const speciality of addedSpecialities) {
    await addBusinessSpeciality({
      businessId: props.businessId,
      specialityName: speciality.speciality,
      price: speciality.price,
    })
  }

  // Delete removed specialities
  for (const speciality of deletedSpecialities) {
    await deleteBusinessSpeciality({
      businessId: props.businessId,
      specialityName: speciality.speciality,
    })
  }

  // Update modified specialities by deleting and re-adding them
  for (const speciality of modifiedSpecialities) {
    // Delete the old speciality
    await deleteBusinessSpeciality({
      businessId: props.businessId,
      specialityName: speciality.speciality,
    })
    // Re-add the speciality with the new price
    await addBusinessSpeciality({
      businessId: props.businessId,
      specialityName: speciality.speciality,
      price: speciality.price,
    })
  }

  // Refresh the lists after saving changes
  businessSpecialities.value = await getBusinessSpecialities({
    businessId: props.businessId,
  })
  adjustedBusinessSpecialities.value = businessSpecialities.value.map((s) => ({
    ...s,
  }))

  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 1500)
}
</script>

<template>
  <InfoToast :showToast="showToast" :buttonText="'Changes saved!'" />
  <form @submit.prevent="saveChanges">
    <h3>Business Specialities</h3>
    <div class="all-specialities">
      <div
        class="existing-speciality-wrapper"
        v-for="(speciality, index) in adjustedBusinessSpecialities"
        :key="speciality.speciality"
      >
        <h4>{{ speciality.speciality }}</h4>
        <input
          type="number"
          v-model.number="speciality.price"
          placeholder="Price"
          min="0"
        />
        <span>EUR</span>
        <button
          class="btn-secondary"
          type="button"
          @click="removeSpeciality(index)"
        >
          Remove
        </button>
      </div>
    </div>

    <div class="new-speciality-wrapper" v-if="availableSpecialities.length > 0">
      <div class="new-speciality-input">
        <select name="speciality" id="speciality" v-model="selectedSpeciality">
          <option value="" disabled selected>Select a speciality</option>
          <option v-for="bs in availableSpecialities" :key="bs" :value="bs">
            {{ bs }}
          </option>
        </select>
        <input
          id="price"
          type="number"
          v-model="selectedPrice"
          placeholder="Price"
          min="1"
        />
        <button
          type="button"
          :disabled="
            selectedSpeciality === '' ||
            selectedPrice === undefined ||
            selectedPrice === 0
          "
          @click="addSpeciality"
          class="btn-secondary"
        >
          Add new
        </button>
      </div>
    </div>
    <button class="btn-primary" type="submit">Save changes</button>
  </form>
</template>

<style scoped>
h3 {
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: Calistoga, sans-serif;
}

h4 {
  margin: 0;
}
form {
  display: flex;
  flex: 1 1 0;
  width: 100%;
  flex-direction: column;
  border: 2px dashed var(--purple-100);
  padding: 16px;
  border-radius: 16px;
  max-height: fit-content;
}

.all-specialities {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.existing-speciality-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  gap: 8px;
  border: 2px dashed var(--purple-100);
  padding: 16px;
  border-radius: 16px;
}

.new-speciality-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-left: 4px;
  padding-right: 4px;
  gap: 16px;
}

.new-speciality-input {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.btn-primary {
  margin-top: 32px;
  max-height: fit-content;
  margin-left: auto;
}

.btn-secondary {
  max-width: fit-content;
  flex: 0 0 auto;
  margin-left: auto;
  max-height: fit-content;
}

input {
  max-width: 55px;
}
</style>
