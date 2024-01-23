import type { IList } from '../IList'
import type { ISpec } from './ISpec'
import type { ISpecParams } from './ISpecParams'
import { Spec } from './Spec'
import type { SpecError } from './SpecError'

export class SpecList implements IList<Spec> {
  private specs: Spec[] = []

  constructor(config: ISpec[], params: ISpecParams) {
    this.specs = config.map((spec) => new Spec(spec, params))
  }

  async test(feature: string, baseUrl: string) {
    const errors: SpecError[] = []
    for (const spec of this.specs) {
      const error = await spec.test(feature, baseUrl)
      if (error) errors.push(error)
    }
    return errors
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
