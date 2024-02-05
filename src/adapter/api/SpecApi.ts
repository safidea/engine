import { type Drivers } from '@adapter/spi'
import { SpecMapper } from './mappers/spec/SpecMapper'
import type { Spec } from '@domain/entities/spec/Spec'
import { SpecError } from '@domain/entities/spec/SpecError'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { Spec as SpecConfig } from './configs/spec/Spec'

export class SpecApi extends Api<SpecConfig, SpecError, Spec> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, SpecMapper, 'spec')
  }
}
