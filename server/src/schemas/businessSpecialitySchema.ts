import { z } from 'zod'
import type { BusinessSpecialities } from '@server/database/types'
import { idSchema } from './shared'

export const BusinesSpecialitySchema = z.object({
  id: idSchema,
  businessId: idSchema,
  specialityId: idSchema,
  price: z.number().int().positive()
})

export type BusinessSpeciality = z.infer<
  typeof BusinesSpecialitySchema
>

export const businessKeysAll = Object.keys(
  BusinesSpecialitySchema.shape
) as (keyof BusinessSpecialities)[]

export const newBusinessSpeciality = BusinesSpecialitySchema.omit({
  id: true
})

