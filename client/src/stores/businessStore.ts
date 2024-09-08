import { defineStore } from 'pinia'
import { ref } from 'vue'

const useBusinessStore = defineStore('business', () => {
  const allSpecialities = ref<{ id: number; speciality: string }[]>()

  const userSpecialities = ref<string[]>()

  return { allSpecialities, userSpecialities }
})

export default useBusinessStore
