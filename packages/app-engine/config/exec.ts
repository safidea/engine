import { ConfigUtils } from 'server-common'
import { DatabaseConfig } from 'server-database'
import { TableConfig } from 'server-table'
import { PageConfig } from 'server-page'

export default function exec() {
  ConfigUtils.exec([DatabaseConfig, TableConfig, PageConfig])
}
