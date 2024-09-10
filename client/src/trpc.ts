// import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { apiBase } from '@/config'
import { getStoredAccessToken } from '@/utils/auth'
import SuperJSON from 'superjson'
import {
  createTRPCProxyClient,
  httpBatchLink,
  type TRPCLink,
} from '@trpc/client'
import { observable } from '@trpc/server/observable'
import router from '@/router'
import { logout } from '@/stores/user'

// custom link that logs out the user if the token is invalid/expired to redirect to login page
const customLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value)
        },
        error(err) {
          if (err.message.includes('Invalid token')) {
            logout()
            router.push({ name: 'login' })
          } else {
            observer.error(err)
          }
        },
        complete() {
          observer.complete()
        },
      })
      return unsubscribe
    })
  }
}

export const trpc = createTRPCProxyClient<AppRouter>({
  // auto convert Date <-> string
  transformer: SuperJSON,
  links: [
    customLink,
    httpBatchLink({
      url: apiBase,

      // send the access token with every request
      headers: () => {
        const token = getStoredAccessToken(localStorage)

        if (!token) return {}

        return {
          Authorization: `Bearer ${token}`,
        }
      },
    }),
  ],
})
