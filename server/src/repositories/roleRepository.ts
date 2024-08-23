import type { Database } from '@server/database'

export function roleRepository(db: Database) {
  return {
    async add_role_to_user(
      userId: number,
      roleId: number
    ): Promise<{ registeredUserId: number; roleId: number } | undefined> {
      return db
        .insertInto('userRoles')
        .values({ registeredUserId: userId, roleId: roleId })
        .returning(['registeredUserId', 'roleId'])
        .executeTakeFirstOrThrow()
    },

    async get_role_types(): Promise< { id: number; role: string; }[]> {
      return db
        .selectFrom('roleTypes')
        .selectAll()
        .execute()
    },

    async get_user_assigned_roles(userId: number): Promise< { registeredUserId: number; roleId: number; }[]> {
      return db
        .selectFrom('userRoles')
        .selectAll()
        .where("registeredUserId", '=', userId)
        .execute();

    },
  }
}

export type RoleRepository = ReturnType<typeof roleRepository>
