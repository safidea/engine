import type { Spi } from '@domain/services/Mailer'
import { EmailMapper } from '../mappers/EmailMapper'
import type { FilterDto } from '../dtos/FilterDto'
import type { Filter } from '@domain/entities/Filter'
import { FilterMapper } from '../mappers/FilterMapper'
import type { CreatedEmail } from '@domain/entities/Email/Created'
import type { EmailDto } from '../dtos/EmailDto'

export interface Driver {
  verify: () => Promise<void>
  close: () => Promise<void>
  send: (email: EmailDto) => Promise<void>
  find: (filters: FilterDto[]) => Promise<EmailDto | undefined>
}

export class MailerSpi implements Spi {
  constructor(private _driver: Driver) {}

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

  find = async (filters: Filter[]) => {
    const filtersDto = filters.map((filter) => FilterMapper.toDto(filter))
    const emailSent = await this._driver.find(filtersDto)
    return emailSent ? EmailMapper.toSentEntity(emailSent) : undefined
  }
}
