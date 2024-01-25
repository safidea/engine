import type { Components } from '@domain/components'
import type { Drivers } from '@domain/drivers'

export interface IAppParams {
  drivers: Drivers
  components: Components
  port?: number
}
