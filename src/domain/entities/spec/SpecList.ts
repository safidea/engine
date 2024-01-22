import type { IList } from '../IList'
import type { ISpec } from './ISpec'
import { Spec } from './Spec'

export class SpecList implements IList<Spec> {
  specs: Spec[] = []

  constructor(public config: ISpec[]) {
    this.specs = config.map((spec) => new Spec(spec))
  }

  validateConfig() {
    return []
  }

  includes(name: string) {
    return this.specs.some((spec) => spec.name === name)
  }

  find(name: string) {
    return this.specs.find((spec) => spec.name === name)
  }
}
