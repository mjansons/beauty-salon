import type { Database } from '@server/database'
import { userRepository } from './userRepository'
import { roleRepository } from './roleRepository'
import { specialityRepository } from './specialityRepository'

export type RepositoryFactory = <T>(db: Database) => T

const repositories = { userRepository, roleRepository, specialityRepository }

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
