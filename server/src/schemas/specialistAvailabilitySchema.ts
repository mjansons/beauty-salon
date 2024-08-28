import { z } from 'zod'
import { idSchema } from './shared'

export const SpecialistDaySchema = z.object({
  id: idSchema,
  specialistId: idSchema.describe('the same as registered_user_id'),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().time(),
  endTime: z.string().time(),
})

export const NewSpecialistDaySchema = SpecialistDaySchema.omit({ id: true, specialistId: true })

export const InsertableSpecialistDaySchema = SpecialistDaySchema.omit({ id: true})

export type SpecialistDaySchema = z.infer<typeof SpecialistDaySchema>

export type InsertableSpecialistDaySchema = z.infer<typeof InsertableSpecialistDaySchema>
