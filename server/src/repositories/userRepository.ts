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
    async createRegisteredUser(user: SignupFields): Promise<UserPublic> {
      return await db
        .insertInto('registeredUsers')
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async updateRegisteredUserById(
      id: number,
      updatedUser: Partial<SignupFields>
    ): Promise<UserPublic | undefined> {
      const { ...updateData } = updatedUser
      const result = await db
        .updateTable('registeredUsers')
        .set(updateData)
        .where('id', '=', id)
        .returning(userKeysPublic)
        .executeTakeFirst()

      return result
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

    async getUserRoles(id: number): Promise<string[]> {
      const roles = await db
        .selectFrom('userRoles')
        .innerJoin('roleTypes', 'userRoles.roleId', 'roleTypes.id')
        .where('userRoles.registeredUserId', '=', id)
        .select('roleTypes.role')
        .execute()

      return roles.map((role) => role.role)
    },
    async getUserDetails(id: number): Promise<
      | {
          email: string
          firstName: string
          lastName: string
          phoneNumber: string
        }
      | undefined
    > {
      return await db
        .selectFrom('registeredUsers')
        .where('id', '=', id)
        .select(['firstName', 'lastName', 'email', 'phoneNumber'])
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
