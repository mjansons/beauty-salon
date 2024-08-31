import { z } from 'zod'
import type { BusinessSpecialities } from '@server/database/types'
import { idSchema } from './shared'

export const businesSpecialitySchema = z.object({
  id: idSchema,
  businessId: idSchema,
  specialityId: idSchema,
  price: z.number().int().positive()
})

export type BusinessSpeciality = z.infer<
  typeof businesSpecialitySchema
>

export const businessKeysAll = Object.keys(
  businesSpecialitySchema.shape
) as (keyof BusinessSpecialities)[]


export const newBusinessSpeciality = z.object({
  businessId: idSchema,
  specialityName: z.string().min(3).max(50),
  price: z.number().int().positive()
})