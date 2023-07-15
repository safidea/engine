import PrismaOrmProvider from './orm/prisma.orm.provider'
import JsonOrmProvider from './orm/json.orm.provider'
import NextAppProvider from './app/next.app.provider'
import debug from 'debug'

import type { OrmProviderInterface } from 'server-database'
import type { AppProviderInterface } from 'shared-common'
import type { ProviderProps } from '../../domain/interfaces/provider'

const { FOUNDATION_APP_PROVIDER = 'next', FOUNDATION_ORM_PROVIDER = 'prisma' } = process.env

const log: debug.IDebugger = debug('foundation:providers')

export function getOrmProvider({ configUtils, pathUtils }: ProviderProps): OrmProviderInterface {
  log(`Load "${FOUNDATION_ORM_PROVIDER}" as ORM provider`)
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
  log(`Load "${FOUNDATION_APP_PROVIDER}" as app provider`)
  switch (FOUNDATION_APP_PROVIDER) {
    case 'next':
      return new NextAppProvider({ configUtils, pathUtils })
    default:
      throw new Error(`App provider ${FOUNDATION_APP_PROVIDER} not found`)
  }
}
