import { ConfigUtils } from 'server-common'
import { DatabaseConfig } from 'server-database'
import { TableConfig } from 'server-table'
import { ComponentConfig } from 'server-component'
import { PageConfig } from 'server-page'

export default async function run() {
  return ConfigUtils.exec([DatabaseConfig, TableConfig, ComponentConfig, PageConfig])
}
