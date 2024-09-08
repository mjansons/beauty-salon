import { defineStore } from 'pinia'
import { ref } from 'vue'

const useBusinessStore = defineStore('business', () => {
  const allSpecialities = ref<{ id: number; speciality: string }[]>()

  return { allSpecialities }
})

export default useBusinessStore
