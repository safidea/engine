import type { IdGenerator } from '@domain/services/IdGenerator'
import { Base } from './base'

interface Config {
  name: string
  data: string | Buffer | Uint8Array
}

interface Services {
  idGenerator: IdGenerator
}

export class CreatedFile extends Base {
  constructor(config: Config, services: Services) {
    const { idGenerator } = services
    const { data, name } = config
    super({
      id: idGenerator.forFile(),
      name,
      data: Buffer.from(data),
      created_at: new Date(),
    })
  }
}
