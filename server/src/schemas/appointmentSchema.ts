import { z } from 'zod'
import type { UserAppointments } from '@server/database/types'
import { idSchema } from './shared'

export const userAppointmentsSchema = z.object({
  id: idSchema,
  appointmentStartTime: z.date(),
  appointmentEndTime: z.date(),
  businessId: idSchema,
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  createdAt: z.date(),
  phoneNumber: z.string().min(8).max(15),
  registeredClientId: idSchema,
  businessSpecialityId: idSchema,
  specialistId: idSchema,
})

export const appointmentKeysAll = Object.keys(
  userAppointmentsSchema.shape
) as (keyof UserAppointments)[]

export const RegisteredAppointmentsSchema = userAppointmentsSchema.pick({
  appointmentStartTime: true,
  appointmentEndTime: true,
  businessId: true,
  businessSpecialityId: true,
  specialistId: true,
})
export type RegisteredAppointments = z.infer<typeof RegisteredAppointmentsSchema>
