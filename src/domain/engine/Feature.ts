import type { Base } from './base'
import type { Spec } from './spec/Spec'
import type { Logger } from '@domain/services/Logger'
import type { App } from './App'
import type { ConfigError } from '@domain/entities/error/Config'
import type { TestError } from '@domain/entities/error/Test'

interface Params {
  name: string
  specs: Spec[]
  logger: Logger
}

export class Feature implements Base {
  name: string

  constructor(private params: Params) {
    this.name = params.name
  }

  init = async () => {
    const { specs } = this.params
    await Promise.all(specs.map((spec) => spec.init()))
  }

  validateConfig = async () => {
    await this.init()
    const errors: Promise<ConfigError[]>[] = []
    const { specs } = this.params
    if (specs) errors.push(...specs.map((spec) => spec.validateConfig()))
    return Promise.all(errors).then((errors) => errors.flat())
  }

  test = async (callback: () => Promise<App>): Promise<TestError[]> => {
    await this.init()
    const { logger, specs } = this.params
    const errors: TestError[] = []
    logger.log(`start testing specs`)
    const results = await Promise.all(specs.flatMap(async (spec) => spec.test(await callback())))
    for (const result of results) if (result) errors.push(result)
    logger.log(`finish testing specs with ${errors.length} error(s)`)
    return errors
  }
}
