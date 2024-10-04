import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface BusinessAvailability {
  businessId: number
  dayOfWeek: number
  endTime: string
  id: Generated<number>
  startTime: string
}

export interface BusinessEmployees {
  businessId: number
  createdAt: Generated<Timestamp>
  employeeId: number
  id: Generated<number>
}

export interface Businesses {
  address: string
  city: string
  createdAt: Generated<Timestamp>
  email: string
  id: Generated<number>
  name: string
  ownerId: number
  phoneNumber: string
  postalCode: string
}

export interface BusinessSpecialities {
  businessId: number
  id: Generated<number>
  price: number
  specialityId: number
}

export interface Invitations {
  businessId: number
  createdAt: Generated<Timestamp>
  employeeId: number
}

export interface RegisteredUsers {
  createdAt: Generated<Timestamp>
  firstName: string
  lastName: string
  email: string
  id: Generated<number>
  isOnboarded: Generated<boolean>
  password: string
  phoneNumber: string
}

export interface RoleTypes {
  id: Generated<number>
  role: string
}

export interface SpecialistAvailability {
  dayOfWeek: number
  endTime: string
  id: Generated<number>
  specialistId: number
  startTime: string
}

export interface Specialists {
  createdAt: Generated<Timestamp>
  registeredUserId: number
  specialityId: number
}

export interface Specialities {
  id: Generated<number>
  speciality: string
}

export interface UserAppointments {
  appointmentEndTime: Timestamp
  appointmentStartTime: Timestamp
  businessId: number
  businessSpecialityId: number
  clientId: number | null
  comment: string | null
  createdAt: Generated<Timestamp>
  email: string
  firstName: string
  id: Generated<number>
  lastName: string
  phoneNumber: string
  specialistId: number
}

export interface UserRoles {
  registeredUserId: number
  roleId: number
}

export interface DB {
  businessAvailability: BusinessAvailability
  businessEmployees: BusinessEmployees
  businesses: Businesses
  businessSpecialities: BusinessSpecialities
  invitations: Invitations
  registeredUsers: RegisteredUsers
  roleTypes: RoleTypes
  specialistAvailability: SpecialistAvailability
  specialists: Specialists
  specialities: Specialities
  userAppointments: UserAppointments
  userRoles: UserRoles
}
