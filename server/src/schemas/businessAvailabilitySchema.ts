import { z } from 'zod'
import { idSchema } from './shared'

export const BusinessDaySchema = z.object({
  id: idSchema,
  businessId: idSchema,
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().time(),
  endTime: z.string().time(),
})

export const NewBusinessDaySchema = BusinessDaySchema.omit({ id: true })

export type BusinessDaySchema = z.infer<typeof BusinessDaySchema>