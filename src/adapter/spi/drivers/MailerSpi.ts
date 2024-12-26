import type { IMailerSpi } from '@domain/services/Mailer'
import { EmailMapper } from '../mappers/EmailMapper'
import type { Filter, FilterDto } from '@domain/entities/Filter'
import type { CreatedEmail } from '@domain/entities/Email/Created'
import type { EmailDto } from '../dtos/EmailDto'
import { FilterMapper } from '../mappers/FilterMapper'

export interface IMailerDriver {
  verify: () => Promise<void>
  close: () => Promise<void>
  send: (email: EmailDto) => Promise<void>
  find: (filter: FilterDto) => Promise<EmailDto | undefined>
}

export class MailerSpi implements IMailerSpi {
  constructor(private _driver: IMailerDriver) {}

  verify = async () => {
    await this._driver.verify()
  }

  close = async () => {
    await this._driver.close()
  }

  send = async (createdEmail: CreatedEmail) => {
    const emailDto = EmailMapper.toDto(createdEmail)
    await this._driver.send(emailDto)
  }

  find = async (filter: Filter) => {
    const filterDto = FilterMapper.toDto(filter)
    const emailSent = await this._driver.find(filterDto)
    return emailSent ? EmailMapper.toSentEntity(emailSent) : undefined
  }
}
