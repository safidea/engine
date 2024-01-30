import type { Components } from '@domain/components'
import type { Drivers } from '@domain/drivers'
import type { IEntityParams } from '../IEntityParams'

export interface IAppParams extends IEntityParams {
  drivers: Drivers
  components: Components
  port?: number
}
