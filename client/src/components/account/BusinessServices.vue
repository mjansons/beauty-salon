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
    <p>Business Specialities</p>
    <div
      v-for="(speciality, index) in adjustedBusinessSpecialities"
      :key="speciality.speciality"
    >
      <span>{{ speciality.speciality }} - </span>
      <input
        type="number"
        v-model.number="speciality.price"
        placeholder="Price"
        min="0"
      />
      <span>EUR</span>
      <button type="button" @click="removeSpeciality(index)">Remove</button>
    </div>
    <div class="new-speciality-wrapper" v-if="availableSpecialities.length > 0">
      <select name="speciality" id="speciality" v-model="selectedSpeciality">
        <option value="" disabled selected>Select a speciality</option>
        <option v-for="bs in availableSpecialities" :key="bs" :value="bs">
          {{ bs }}
        </option>
      </select>
      <label for="price">Price</label>
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
      >
        Add
      </button>
    </div>
    <button type="submit">Save Changes</button>
  </form>
</template>

<style scoped></style>
