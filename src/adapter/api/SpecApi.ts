import { SpecMapper, type Params } from './mappers/spec/SpecMapper'
import type { Spec } from '@domain/entities/spec/Spec'
import { SpecError } from '@domain/entities/spec/SpecError'
import type { Params as SpisParams } from '@adapter/spi'
import { Api } from './Api'
import type { Spec as SpecConfig } from './configs/spec/Spec'

export class SpecApi extends Api<SpecConfig, SpecError, Spec, Params> {
  constructor(params: SpisParams) {
    super(params, SpecMapper, 'spec')
  }
}
