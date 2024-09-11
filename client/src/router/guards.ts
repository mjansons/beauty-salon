import { isLoggedIn, isOnboarded } from '@/stores/user'

export const authenticate = () => {
  if (!isLoggedIn.value) return { name: 'login' }
  if (!isOnboarded.value) return { name: 'onboarding' }
  return true
}

export const checkIfOnboarded = () => {
  if (!isLoggedIn.value) return { name: 'login' }
  if (isOnboarded.value) return { name: 'dashboard' }
  return true
}

export const redirectToDashboardIfLoggedIn = () => {
  if (isLoggedIn.value) {
    if (!isOnboarded) {
      return { name: 'onboarding' }
    }
    return { name: 'dashboard' }
  }
  return true
}
