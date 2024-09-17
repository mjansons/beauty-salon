import { trpc } from '@/trpc'

export const getAllSpecialities = trpc.business.getAllSpecialities.query
export const getAllLocations = trpc.business.getAllCities.query
export const getSpecialistSlots = trpc.appointments.getSlotInfo.query