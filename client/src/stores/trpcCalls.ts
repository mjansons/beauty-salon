import { trpc } from '@/trpc'

// common
export const getUserRoles = trpc.user.getUserRoles.query
export const getAllSpecialities = trpc.business.getAllSpecialities.query

// client
export const getUserDetails = trpc.user.getUserDetails.query
export const updateUserDetails = trpc.user.updateUserDetails.mutate
export const addSpecialityToUser = trpc.user.addSpecialityToUser.mutate

// specialist
export const getEmployerDetails = trpc.business.getEmployerDetails.query
export const getUsersSpecialities = trpc.user.getUsersSpecialities.query
export const removeSpecialityFromUser =
  trpc.user.removeSpecialityFromUser.mutate

// invitations
export const getUsersInvitations = trpc.invitations.getUserInvitations.query
export const acceptInvitation = trpc.invitations.acceptInvitation.mutate
export const rejectInvitation = trpc.invitations.deleteInvitation.mutate
export const inviteEmployee = trpc.invitations.inviteEmployee.mutate

// appointments
export const getSpecialistAppointments =
  trpc.appointments.getSpecialistAppointments.query
export const getPesronalAppointments =
  trpc.appointments.getPersonalAppointments.query
export const getBusinessAppointments =
  trpc.appointments.getBusinessAppointments.query

// business
export const getSpecialistSlots = trpc.appointments.getSlotInfo.query
export const updateBusinessDetails = trpc.business.updateBusinessDetails.mutate
export const getAllLocations = trpc.business.getAllCities.query
export const getOwnerBusinesses = trpc.business.getOwnerBusinesses.query
export const getEmployees = trpc.business.getAllEmployees.query
export const deleteEmployee = trpc.business.deleteEmployee.mutate
export const getBusinessSpecialities =
  trpc.business.getAllBusinessSpecialities.query
export const deleteBusinessSpeciality =
  trpc.business.deleteBusinessSpeciality.mutate

// specialist hours
export const addSpecialistHours = trpc.user.addSpecialistHours.mutate
export const getSpecialistHours = trpc.user.getSpecialistHours.query
export const deleteAllSpecialistHours =
  trpc.user.deleteAllSpecialistHours.mutate
export const addBusinessSpeciality = trpc.business.addBusinessSpeciality.mutate

// business hours
export const deleteAllBusinessHours =
  trpc.business.deleteAllBusinessHours.mutate
export const addBusinessHoursToDay = trpc.business.addBusinessHours.mutate
export const getAllBusinessHours = trpc.business.getAllBusinessHours.query
