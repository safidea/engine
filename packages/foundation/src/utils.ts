import PrismaOrmProvider from './providers/orm/prisma.orm.provider'
import NextAppProvider from './providers/app/next.app.provider'

import type { DatabaseInterface, OrmProviderInterface } from 'server-database'
import type { AppProviderInterface } from 'shared-common'
import type { PagesInterface } from 'shared-page'

const { FOUNDATION_SERVER, FOUNDATION_ORM } = process.env

export function getOrmProvider({
  appVersion,
  appName,
  database,
}: {
  appVersion: string
  appName: string
  database: DatabaseInterface
}): OrmProviderInterface {
  switch (FOUNDATION_ORM) {
    case 'prisma':
      return new PrismaOrmProvider({ appVersion, appName, database })
      break
    default:
      throw new Error('ORM provider not found')
  }
}

export function getAppProvider({ pages }: { pages?: PagesInterface }): AppProviderInterface {
  switch (FOUNDATION_SERVER) {
    case 'next':
      return new NextAppProvider({ pages })
      break
    default:
      throw new Error('App provider not found')
  }
}