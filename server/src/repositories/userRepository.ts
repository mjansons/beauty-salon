import type { Database } from '@server/database'
import type { RegisteredUsers } from '@server/database/types'
import {
  type UserPublic,
  userKeysAll,
  userKeysPublic,
} from '@server/schemas/registeredUser'
import type { Selectable } from 'kysely'
import { type SignupFields } from '@server/schemas/registeredUser'

export function userRepository(db: Database) {
  return {
    async createRegisteredUser(
      user: SignupFields
    ): Promise<UserPublic> {
      return await db
        .insertInto('registeredUsers')
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },


    async findRegisteredUserByEmail(
      email: string
    ): Promise<Selectable<RegisteredUsers> | undefined> {
      return await db
        .selectFrom('registeredUsers')
        .select(userKeysAll)
        .where('email', '=', email)
        .executeTakeFirst()
    },

    async findRegisteredUserById(
      id: number
    ): Promise<Selectable<RegisteredUsers> | undefined> {
      return await db
        .selectFrom('registeredUsers')
        .select(userKeysAll)
        .where('id', '=', id)
        .executeTakeFirst()
    },

    async updateRegisteredUserRow(
      id: number,
      row: string,
      newValue: string
    ): Promise<UserPublic | undefined> {
      return await db
        .updateTable('registeredUsers')
        .set({
          [row]: newValue,
        })
        .where('id', '=', id)
        .returning(userKeysPublic)
        .executeTakeFirst()
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
