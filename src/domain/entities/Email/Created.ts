import { IdGenerator } from '@domain/services/IdGenerator'
import { Base, type EmailFields } from './base'

type Config = Omit<EmailFields, 'id'>

interface Services {
  idGenerator: IdGenerator
}

export class CreatedEmail extends Base {
  constructor(config: Config, services: Services) {
    const { idGenerator } = services
    super({
      ...config,
      id: idGenerator.forEmail(),
    })
  }
}
