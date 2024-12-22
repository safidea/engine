import { IdGenerator } from '@domain/services/IdGenerator'
import { BaseEmail, type EmailFields } from './base'

type CreatedEmailConfig = Omit<EmailFields, 'id'>

interface CreatedEmailServices {
  idGenerator: IdGenerator
}

export class CreatedEmail extends BaseEmail {
  constructor(config: CreatedEmailConfig, services: CreatedEmailServices) {
    const { idGenerator } = services
    super({
      ...config,
      id: idGenerator.forEmail(),
    })
  }
}
