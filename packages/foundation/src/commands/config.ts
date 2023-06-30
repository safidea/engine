import { ConfigUtils, PathUtils } from 'server-common'
import { DatabaseConfig } from 'server-database'
import { TableConfig } from 'server-table'
import { ComponentConfig } from 'server-component'
import { PageConfig } from 'server-page'
import { getAppProvider, getOrmProvider } from '../utils'

import type { AppConfig, ConfigsExecInterface } from 'shared-app'

export default async function Config() {
  const options = process.argv.slice(3)
  const noCache = options.includes('--no-cache')

  const pathUtils = new PathUtils()
  const configUtils = new ConfigUtils({ pathUtils })
  const {
    version: appVersion,
    name: appName,
    database,
    tables,
    components,
    pages,
  } = configUtils.get() as AppConfig

  const configs: ConfigsExecInterface = {}
  const appProvider = getAppProvider({ pathUtils, configUtils })
  await appProvider.writeFoundationFile({ withOrm: !!database, withComponents: !!pages })

  if (database) {
    const ormProvider = getOrmProvider({ pathUtils, configUtils })
    configs.database = new DatabaseConfig({ ormProvider, configUtils })
    if (tables) configs.tables = new TableConfig({ appProvider, ormProvider, configUtils })
  }
  if (pages) {
    configs.pages = new PageConfig({ configUtils, appProvider })
    if (components) configs.components = new ComponentConfig({ configUtils, appProvider })
  }

  await configUtils.exec(configs, noCache)
}
