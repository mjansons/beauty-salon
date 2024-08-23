import config from '@server/config'
import { createDatabase } from '@server/database'

/**
 * Creates a test database instance
 */
export const createTestDatabase = () => createDatabase(config.test_database)
