import { trpc } from '@/trpc'

export const getAllSpecialities = trpc.business.getAllSpecialities.query
export const getAllLocations = trpc.business.getAllCities.query
export const getSpecialistSlots = trpc.appointments.getSlotInfo.query

export const getUserRoles = trpc.user.getUserRoles.query
export const getUserDetails = trpc.user.getUserDetails.query
export const updateUserDetails = trpc.user.updateUserDetails.mutate
export const getUsersSpecialities = trpc.user.getUsersSpecialities.query
export const addSpecialityToUser = trpc.user.addSpecialityToUser.mutate
export const removeSpecialityFromUser =
  trpc.user.removeSpecialityFromUser.mutate
export const getUsersInvitations = trpc.invitations.getUserInvitations.query
export const acceptInvitation = trpc.invitations.acceptInvitation.mutate
export const rejectInvitation = trpc.invitations.deleteInvitation.mutate
export const getSpecialistAppointments =
  trpc.appointments.getSpecialistAppointments.query
