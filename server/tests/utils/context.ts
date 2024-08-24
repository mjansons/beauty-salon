import { authUserSchema, type AuthUser } from '@server/schemas/registeredUser'
import type { Context, ContextMinimal } from '@server/trpc'

export const requestContext = (
  context: Partial<Context> & ContextMinimal
): Context => ({
  req: {
    header: () => undefined,
    get: () => undefined,
  } as any,
  res: {
    cookie: () => undefined,
  } as any,
  ...context,
})

export const authContext = (
  context: Partial<Context> & ContextMinimal,
  user: AuthUser = {
    id: 123,
    email: "test@email.com",
    firstName: "John",
    lastName: "Smith",
    phoneNumber: "+3712348"
  }
): Context => ({
  authUser: authUserSchema.parse(user),
  ...context,
})

export const authRepoContext = (
  repositories: any, // Context['repositories'], but easier to work with any in tests
  user: AuthUser = {
    id: 123,
    email: "test@email.com",
    firstName: "John",
    lastName: "Smith",
    phoneNumber: "+3712348"
  }
): Context => ({
  authUser: authUserSchema.parse(user),
  ...requestContext({
    db: {} as any,
    repositories,
  }),
})
