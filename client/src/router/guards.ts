import useUserStore from '@/stores/user'

const userStore = useUserStore()

export const authenticate = () => {
  if (!userStore.isLoggedIn) return { name: 'Login' }

  return true
}
