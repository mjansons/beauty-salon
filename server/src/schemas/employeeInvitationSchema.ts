import { z } from 'zod'
import type { Invitations } from '@server/database/types'
import { idSchema } from './shared'

export const invitationSchema = z.object({
  businessId: idSchema,
  employeeId: idSchema,
  createdAt: z.date(),
})

export type Invitation = z.infer<typeof invitationSchema>

export const invitationKeysAll = Object.keys(
  invitationSchema.shape
) as (keyof Invitations)[]

export const createInvitationSchema = invitationSchema.pick({
  businessId: true,
  employeeId: true,
})

export type CreateInvitation = z.infer<typeof createInvitationSchema>
