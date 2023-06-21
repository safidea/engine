import PrismaDatabaseProvider from '../providers/database/prisma.database.provider'
import JsonDatabaseProvider from '../providers/database/json.database.provider'

const { APP_PATH, DATABASE_PROVIDER } = process.env

export function getAppPath() {
  if (!APP_PATH) throw new Error('APP_PATH is not defined')
  return APP_PATH
}

export function getDatabaseProviderName() {
  if (!DATABASE_PROVIDER) throw new Error('DATABASE_PROVIDER is not defined')
  return DATABASE_PROVIDER
}

export function getDatabaseProvider() {
  switch (getDatabaseProviderName()) {
    case 'json':
      return JsonDatabaseProvider
    case 'prisma':
      return PrismaDatabaseProvider
    default:
      throw new Error(`DATABASE_PROVIDER ${DATABASE_PROVIDER} is not supported`)
  }
}
