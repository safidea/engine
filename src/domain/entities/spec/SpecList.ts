import type { IList } from '../IList'
import type { ISpec } from './ISpec'
import { Spec } from './Spec'

export class SpecList implements IList<Spec> {
  private specs: Spec[] = []

  constructor(config: ISpec[]) {
    this.specs = config.map((spec) => new Spec(spec))
  }

  validateConfig() {
    return this.specs.flatMap((spec) => spec.validateConfig())
  }

  includes(name: string) {
    return this.specs.some((spec) => spec.name === name)
  }

  find(name: string) {
    return this.specs.find((spec) => spec.name === name)
  }
}
