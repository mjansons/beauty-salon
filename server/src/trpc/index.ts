import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { Database } from '@server/database'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { Repositories } from '@server/repositories'
import { type AuthUser } from '@server/schemas/registeredUser'

export type Context = {
  db: Database
  repositories?: Partial<Repositories>
  authUser?: AuthUser
  req?: Request
  res?: Response
}

export type ContextMinimal = Pick<Context, 'db'>

export default initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter(opts) {
    const { shape, error } = opts

    if (error.cause instanceof ZodError) {
      const validationError = fromZodError(error.cause)

      return {
        ...shape,
        data: {
          message: validationError.message,
        },
      }
    }

    return shape
  },
})
