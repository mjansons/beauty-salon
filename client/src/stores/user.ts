import { defineStore } from 'pinia'
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
} from '@/utils/auth'
import { trpc } from '@/trpc'
import { computed, ref } from 'vue'

const useUserStore = defineStore('user', () => {
  // Intial state.
  const authToken = ref<string | null>(getStoredAccessToken(localStorage))

  // Our client knowing about authUserId is not needed in our current setup
  // but it would be useful in most real-world apps.
  const authUserId = computed(() =>
    authToken.value ? getUserIdFromToken(authToken.value) : null
  )

  // This could be a function that we call instead of a computed property.
  const isLoggedIn = computed(() => !!authToken.value)

  // Log in a user and store the access token in the store and in the local storage.
  async function login(userLogin: { email: string; password: string }) {
    const { accessToken } = await trpc.user.login.mutate(userLogin)

    authToken.value = accessToken
    storeAccessToken(localStorage, accessToken)
  }

  function logout() {
    authToken.value = null
    clearStoredAccessToken(localStorage)
  }

  const signup = trpc.user.signup.mutate

  return { authUserId, isLoggedIn, login, logout, signup }
})

export default useUserStore
