import type { Database } from '@server/database'

export function businessRepository(db: Database) {
  return {
    async get_business_employees_by_business_id(businessId: number): Promise<
      {
        businessId: number
        createdAt: Date
        employeeId: number
        id: number
      }[]
    > {
      return db
        .selectFrom('businessEmployees')
        .selectAll()
        .where('businessId', '=', businessId)
        .execute()
    },

    async get_business_working_hours_by_id(businessId: number): Promise<
      { id: number,
        businessId: number,
        dayOfWeek: number,
        startTime: string,
        endTime: string}[]
    > {
      return db
        .selectFrom('businessAvailability')
        .selectAll()
        .where('businessId', '=', businessId)
        .execute()
    },



  }
}

export type BusinessRepository = ReturnType<typeof businessRepository>
