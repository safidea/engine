import type { IList } from '../IList'
import type { ISpec } from './ISpec'
import { SpecEntity } from './SpecEntity'

export class SpecList implements IList<SpecEntity> {
  specs: SpecEntity[] = []

  constructor(public config: ISpec[]) {
    this.specs = config.map((spec) => new SpecEntity(spec))
  }

  validateConfig() {
    return []
  }

  includes(name: string) {
    return this.specs.some((spec) => spec.config.name === name)
  }

  find(name: string) {
    return this.specs.find((spec) => spec.config.name === name)
  }
}
