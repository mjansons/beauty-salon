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
        .where("email", "=", email)
        .executeTakeFirst()
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
