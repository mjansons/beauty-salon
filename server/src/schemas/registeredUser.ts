import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { RegisteredUsers } from '@server/database/types'
import { idSchema } from './shared'

export const registeredUserSchema = z.object({
  id: idSchema,
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long'),
  firstName: z.string().trim().toLowerCase().max(100),
  lastName: z.string().trim().toLowerCase().max(100),
  phoneNumber: z.string().max(15),
  isOnboarded: z.boolean().default(false),
  createdAt: z.date(),
})

export const signupSchema = registeredUserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  password: true,
  isOnboarded: true,
})

export const updateSchema = registeredUserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  password: true,
  isOnboarded: true,
})

// export const loginSchema =  z.object({
//   id: idSchema,
//   email: z.string().trim().toLowerCase().email(),
//   password: z
//     .string()
//     .min(8, 'Password must be at least 8 characters long')
//     .max(64, 'Password must be at most 64 characters long'),
//   firstName: z.string().trim().toLowerCase().max(100).nullable(),
//   lastName: z.string().trim().toLowerCase().max(100).nullable(),
//   phoneNumber: z.string().max(15),
//   isOnboarded: z.boolean().default(false),
//   createdAt: z.date(),
// })

export type SignupFields = z.infer<typeof signupSchema>

export const userKeysAll = Object.keys(
  registeredUserSchema.shape
) as (keyof RegisteredUsers)[]

export const userKeysPublic = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'isOnboarded',
  `createdAt`,
] as const

export type UserPublic = Pick<
  Selectable<RegisteredUsers>,
  (typeof userKeysPublic)[number]
>

export const authUserSchema = registeredUserSchema.pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  isOnboarded: true,
})

export type AuthUser = z.infer<typeof authUserSchema>

export const updateUserSchema = updateSchema.partial()

export type UpdateUserFields = z.infer<typeof updateUserSchema>
