import type { Engine } from '../Engine'
import type { SpecError } from '../spec/SpecError'
import type { Spec } from '../spec/Spec'
import type { EngineError } from '../EngineError'
import type { Logger } from '@domain/services/Logger'
import type { App } from '../app/App'

interface Params {
  name: string
  specs: Spec[]
  logger: Logger
}

export class Feature implements Engine {
  name: string

  constructor(private params: Params) {
    this.name = params.name
  }

  validateConfig() {
    const errors: EngineError[] = []
    const { specs } = this.params
    if (specs) errors.push(...specs.flatMap((spec) => spec.validateConfig()))
    return errors
  }

  async test(callback: () => App): Promise<SpecError[]> {
    const { logger, specs } = this.params
    const errors: SpecError[] = []
    logger.log(`start testing specs`)
    const results = await Promise.all(specs.flatMap((spec) => spec.test(callback())))
    for (const result of results) if (result) errors.push(result)
    logger.log(`finish testing specs with ${errors.length} error(s)`)
    return errors
  }
}
