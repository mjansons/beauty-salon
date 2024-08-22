import config from '@server/config'
import { createDatabase } from '@server/database'
import { migrateLatest } from '@server/database/migrate/latest'

/**
 * Creates a test database instance
 */

export const createTestDatabase = () => createDatabase(config.test_database)