import { Spis, type Drivers } from '@adapter/spi'
import type { ReactComponents } from '@domain/entities/Component'
import { Services } from '@domain/services'

export interface ApiParams {
  drivers?: Partial<Drivers>
  components?: Partial<ReactComponents>
}

export class Api {
  constructor(
    private drivers: Drivers,
    private components: ReactComponents
  ) {}

  protected services = (params?: ApiParams): Services => {
    const { drivers = {}, components = {} } = params ?? {}
    const mergedDrivers = { ...this.drivers, ...drivers }
    const mergedComponents = { ...this.components, ...components }
    return new Services(new Spis(mergedDrivers, mergedComponents))
  }
}
