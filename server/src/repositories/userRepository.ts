import type { Database } from '@server/database'
import type { RegisteredUsers } from '@server/database/types'
import {
  type UserPublic,
  userKeysAll,
  userKeysPublic,
} from '@server/schemas/registeredUser'
import type { Insertable, Selectable } from 'kysely'

export function userRepository(db: Database) {
  return {
    async create_registered_user(
      user: Insertable<RegisteredUsers>
    ): Promise<UserPublic> {
      return db
        .insertInto('registeredUsers')
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async find_registered_user_by_email(
      email: string
    ): Promise<Selectable<RegisteredUsers> | undefined> {
      return db
        .selectFrom('registeredUsers')
        .select(userKeysAll)
        .where('email', '=', email)
        .executeTakeFirst()
    },

    async find_registered_user_by_id(
      id: number
    ): Promise<Selectable<RegisteredUsers> | undefined> {
      return db
        .selectFrom('registeredUsers')
        .select(userKeysAll)
        .where('id', '=', id)
        .executeTakeFirst()
    },

    async update_registered_user_row(
      id: number,
      row: string,
      newValue: string
    ): Promise<UserPublic | undefined> {
      return db
        .updateTable('registeredUsers')
        .set({
          [row]: newValue,
        })
        .where('id', '=', id)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },

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

  }
}

export type UserRepository = ReturnType<typeof userRepository>
