import { type Drivers } from '@adapter/spi'
import { SpecMapper } from './mappers/spec/SpecMapper'
import type { Spec } from '@domain/entities/spec/Spec'
import { SpecError } from '@domain/entities/spec/SpecError'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { SpecDto } from './dtos/spec/SpecDto'

export class SpecApi extends Api<SpecDto, SpecError, Spec> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, SpecMapper, 'spec')
  }
}
