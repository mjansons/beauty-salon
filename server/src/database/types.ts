import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

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
  specialityId: number
}

export interface RegisteredUserAppointments {
  appointmentTime: Timestamp
  businessId: number
  clientId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  serviceId: number
  specialistId: number
  status: string
}

export interface RegisteredUsers {
  createdAt: Generated<Timestamp>
  email: string
  firstName: string
  id: Generated<number>
  lastName: string
  password: string
  phoneNumber: string
}

export interface RoleTypes {
  id: Generated<number>
  role: string
}

export interface Specialists {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  specialistId: number
  specialityId: number
}

export interface Specialities {
  id: Generated<number>
  speciality: string
}

export interface UnregisteredUserAppointments {
  appointmentTime: Timestamp
  businessId: number
  clientId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  serviceId: number
  specialistId: number
  status: string
}

export interface UnregisteredUsers {
  createdAt: Generated<Timestamp>
  email: string | null
  firstName: string
  id: Generated<number>
  lastName: string
  phoneNumber: string
}

export interface UserRoles {
  registeredUserId: number
  roleId: number
}

export interface DB {
  businesses: Businesses
  businessSpecialities: BusinessSpecialities
  registeredUserAppointments: RegisteredUserAppointments
  registeredUsers: RegisteredUsers
  roleTypes: RoleTypes
  specialists: Specialists
  specialities: Specialities
  unregisteredUserAppointments: UnregisteredUserAppointments
  unregisteredUsers: UnregisteredUsers
  userRoles: UserRoles
}
