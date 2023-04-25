import debug from 'debug'
import { ConfigUtils } from '@common/server'
import { DatabaseConfig } from '@database/config'
import { TableConfig } from '@table/config'

import type { ConfigInterface } from '@common'

const log = debug('core:config')

class CoreConfig {
  private Configs: ConfigInterface[] = [DatabaseConfig, TableConfig]

  public init(): void {
    log('load config file')
    ConfigUtils.init()

    log('enrich configs')
    for (const Config of this.Configs) Config.enrich()

    log('validate schemas')
    for (const Config of this.Configs) Config.validate()

    log('setup libs')
    for (const Config of this.Configs) Config.lib()

    log('build js codes')
    for (const Config of this.Configs) Config.js()

    log('cache config file')
    ConfigUtils.cache()
  }
}

export default new CoreConfig()
