import { TableApi } from '@adapter/api/TableApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { Table } from '@adapter/api/configs/table/Table'

export default class extends TableApi {
  constructor() {
    super({
      drivers,
      components,
    })
  }
}
