import type { IdGenerator } from '@domain/services/IdGenerator'
import { BaseFile } from './base'

interface CreatedFileConfig {
  name: string
  data: string | Buffer | Uint8Array
}

interface CreatedFileServices {
  idGenerator: IdGenerator
}

export class CreatedFile extends BaseFile {
  constructor(config: CreatedFileConfig, services: CreatedFileServices) {
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
