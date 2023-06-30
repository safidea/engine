import PrismaOrmProvider from './providers/orm/prisma.orm.provider'
import JsonOrmProvider from './providers/orm/json.orm.provider'
import NextAppProvider from './providers/app/next.app.provider'

import type { OrmProviderInterface } from 'server-database'
import type { AppProviderInterface } from 'shared-common'
import type { ProviderProps } from './interfaces/provider'

const { FOUNDATION_APP_PROVIDER = 'next', FOUNDATION_ORM_PROVIDER = 'prisma' } = process.env

export function getOrmProvider({ configUtils, pathUtils }: ProviderProps): OrmProviderInterface {
  switch (FOUNDATION_ORM_PROVIDER) {
    case 'prisma':
      return new PrismaOrmProvider({ configUtils, pathUtils })
    case 'json':
      return new JsonOrmProvider({ configUtils, pathUtils })
    default:
      throw new Error(`ORM provider ${FOUNDATION_ORM_PROVIDER} not found`)
  }
}

export function getAppProvider({ configUtils, pathUtils }: ProviderProps): AppProviderInterface {
  switch (FOUNDATION_APP_PROVIDER) {
    case 'next':
      return new NextAppProvider({ configUtils, pathUtils })
    default:
      throw new Error(`App provider ${FOUNDATION_APP_PROVIDER} not found`)
  }
}
