import { ConfigUtils } from 'server-common'
import { DatabaseConfig } from 'server-database'
import { TableConfig } from 'server-table'
import { PageConfig } from 'server-page'

ConfigUtils.exec([DatabaseConfig, TableConfig, PageConfig])
