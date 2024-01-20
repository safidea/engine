import type { ISpec } from './ISpec'
import { SpecEntity } from './SpecEntity'

export class SpecList {
  specs: SpecEntity[] = []

  constructor(public config: ISpec[]) {
    this.specs = config.map((spec) => new SpecEntity(spec))
  }
}
