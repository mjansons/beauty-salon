import type { Database } from '@server/database'

export function roleRepository(db: Database) {
  return {
    async addRoleToUser(
      userId: number,
      roleId: number
    ): Promise<{ registeredUserId: number; roleId: number } | undefined> {
      return db
        .insertInto('userRoles')
        .values({ registeredUserId: userId, roleId })
        .returning(['registeredUserId', 'roleId'])
        .executeTakeFirstOrThrow()
    },

    async getAllRoleTypes(): Promise<{ id: number; role: string }[]> {
      return db.selectFrom('roleTypes').selectAll().execute()
    },

    async getRoleByName(
      role: string
    ): Promise<{ id: number; role: string } | undefined> {
      return db
        .selectFrom('roleTypes')
        .where('role', '=', role)
        .selectAll()
        .executeTakeFirst()
    },

    async getUserAllAssignedRoles(
      userId: number
    ): Promise<{ registeredUserId: number; roleId: number }[]> {
      return db
        .selectFrom('userRoles')
        .selectAll()
        .where('registeredUserId', '=', userId)
        .execute()
    },

    async getUserAssignedRoleByRoleId(
      userId: number,
      roleId: number
    ): Promise<{ registeredUserId: number; roleId: number } | undefined> {
      return db
        .selectFrom('userRoles')
        .selectAll()
        .where('registeredUserId', '=', userId)
        .where('roleId', '=', roleId)
        .executeTakeFirst()
    },

    async getRoleByUserIdAndRoleId(
      userId: number,
      roleId: number
    ): Promise<{ registeredUserId: number; roleId: number } | undefined> {
      return db
        .selectFrom('userRoles')
        .selectAll()
        .where('registeredUserId', '=', userId)
        .where('roleId', '=', roleId)
        .executeTakeFirst()
    },
  }
}

export type RoleRepository = ReturnType<typeof roleRepository>
