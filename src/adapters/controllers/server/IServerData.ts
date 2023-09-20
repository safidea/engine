import { PageParams } from '@entities/app/page/PageParams'
import { TableParams } from '@entities/app/table/TableParams'
import { UIDrivers } from '@entities/services/ui/UIDrivers'

export interface IServerData {
  page: PageParams
  tables: TableParams[]
  params: { [key: string]: string }
  uiDriver: UIDrivers
}
