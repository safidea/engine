import { SpecMapper, type Params } from './mappers/spec/SpecMapper'
import type { Spec } from '@domain/engine/spec/Spec'
import type { Params as SpisParams } from '@adapter/spi'
import { Base } from './base'
import type { Spec as Config } from './configs/spec/Spec'

export class SpecApi extends Base<Config, Spec, Params> {
  constructor(params: SpisParams) {
    super(params, SpecMapper, 'spec')
  }
}
