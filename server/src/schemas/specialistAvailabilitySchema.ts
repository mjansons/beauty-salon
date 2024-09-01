import { z } from 'zod'
import { idSchema } from './shared'

export const specialistDaySchema = z.object({
  id: idSchema,
  specialistId: idSchema.describe('the same as registered_user_id'),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().time(),
  endTime: z.string().time(),
})

export const newSpecialistDaySchema = specialistDaySchema.omit({
  id: true,
  specialistId: true,
})

export const InsertableSpecialistDaySchema = specialistDaySchema.omit({
  id: true,
})

export type SpecialistDaySchema = z.infer<typeof specialistDaySchema>

export type InsertableSpecialistDaySchema = z.infer<
  typeof InsertableSpecialistDaySchema
>
