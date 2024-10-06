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
export const getPesronalAppointments =
  trpc.appointments.getPersonalAppointments.query
export const getBusinessAppointments =
  trpc.appointments.getBusinessAppointments.query

export const getEmployerDetails = trpc.business.getEmployerDetails.query
export const deleteAllSpecialistHours =
  trpc.user.deleteAllSpecialistHours.mutate
export const addSpecialistHours = trpc.user.addSpecialistHours.mutate
export const getSpecialistHours = trpc.user.getSpecialistHours.query
export const getOwnerBusinesses =
  trpc.business.getOwnerBusinesses.query
export const updateBusinessDetails = trpc.business.updateBusinessDetails.mutate
