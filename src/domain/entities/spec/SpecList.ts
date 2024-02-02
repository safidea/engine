import type { EngineList } from '../EngineList'
import { Spec, type SpecConfig, type SpecParams } from './Spec'
import type { SpecError } from './SpecError'

export class SpecList implements EngineList<Spec> {
  private specs: Spec[]

  constructor(config: SpecConfig[], params: SpecParams) {
    this.specs = config.map((spec) => new Spec(spec, params))
  }

  async test() {
    const errors: SpecError[] = []
    for (const spec of this.specs) {
      const error = await spec.test()
      if (error) errors.push(error)
    }
    return errors
  }

  get length() {
    return this.specs.length
  }

  get all() {
    return this.specs
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
