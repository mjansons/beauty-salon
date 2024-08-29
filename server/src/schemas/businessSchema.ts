import { z } from 'zod'
import type { Businesses } from '@server/database/types'
import { idSchema } from './shared'

export const BusinessSchema = z.object({
  id: idSchema,
  name: z.string().trim().toLowerCase().min(3).max(50),
  ownerId: idSchema,
  city: z.string().trim().toLowerCase().min(3).max(50),
  address: z.string().trim().toLowerCase().min(3).max(150),
  postalCode: z.string().trim().toLowerCase().min(3).max(150),
  email: z.string().trim().toLowerCase().email(),
  phoneNumber: z.string().min(8).max(15),
  createdAt: z.date(),
})

export type BusinessSchema = z.infer<typeof BusinessSchema>

export const businessKeysAll = Object.keys(
  BusinessSchema.shape
) as (keyof Businesses)[]

export const BusinessRegistrationSchema = BusinessSchema.omit({
  id: true,
  createdAt: true,
  ownerId: true,
})

export const BusinessUpdatingSchema = z.object({
  businessId: idSchema,
  name: z.string().trim().toLowerCase().min(3).max(50),
  city: z.string().trim().toLowerCase().min(3).max(50),
  address: z.string().trim().toLowerCase().min(3).max(150),
  postalCode: z.string().trim().toLowerCase().min(3).max(150),
  email: z.string().trim().toLowerCase().email(),
  phoneNumber: z.string().min(8).max(15),
})
