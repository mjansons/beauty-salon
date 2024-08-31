import { z } from 'zod'
import type { UserAppointments } from '@server/database/types'
import { idSchema } from './shared'

export const userAppointmentsSchema = z.object({
  id: idSchema,
  clientId: idSchema,
  businessId: idSchema,
  specialistId: idSchema,
  businessSpecialityId: idSchema,
  appointmentStartTime: z.date(),
  appointmentEndTime: z.date(),
  firstName: z.string().trim().toLowerCase().min(1).max(100),
  lastName: z.string().trim().toLowerCase().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
  phoneNumber: z.string().min(8).max(15),
  comment: z.string().max(300).optional(),
  createdAt: z.date(),
})

export type Appointments = z.infer<typeof userAppointmentsSchema>

export const appointmentKeysAll = Object.keys(
  userAppointmentsSchema.shape
) as (keyof UserAppointments)[]

export const registeredAppointmentsSchema = userAppointmentsSchema.pick({
  appointmentStartTime: true,
  appointmentEndTime: true,
  businessId: true,
  businessSpecialityId: true,
  specialistId: true,
  comment: true
})
export type RegisteredAppointments = z.infer<
  typeof registeredAppointmentsSchema
>

export const publicAppointmentSchema = userAppointmentsSchema.omit({
  id: true,
  clientId: true,
  createdAt: true,
})
