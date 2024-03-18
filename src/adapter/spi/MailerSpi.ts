import type { Params, Spi } from '@domain/services/Mailer'
import type { SentDto, ToSendDto } from './dtos/EmailDto'
import { EmailMapper } from './mappers/EmailMapper'
import type { ToSend } from '@domain/entities/email/ToSend'
import type { FilterDto } from './dtos/FilterDto'
import type { Filter } from '@domain/entities/filter'
import { FilterMapper } from './mappers/FilterMapper'

export interface Driver {
  params: Params
  verify: () => Promise<void>
  close: () => Promise<void>
  send: (email: ToSendDto) => Promise<SentDto>
  find: (filters: FilterDto[]) => Promise<SentDto | undefined>
}

export class MailerSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  verify = async () => {
    await this.driver.verify()
  }

  close = async () => {
    await this.driver.close()
  }

  send = async (emailToSend: ToSend) => {
    const emailToSendDto = EmailMapper.toToSendDto(emailToSend)
    const emailSent = await this.driver.send(emailToSendDto)
    return EmailMapper.toSentEntity(emailSent)
  }

  find = async (filters: Filter[]) => {
    const filtersDto = filters.map((filter) => FilterMapper.toDto(filter))
    const emailSent = await this.driver.find(filtersDto)
    return emailSent ? EmailMapper.toSentEntity(emailSent) : undefined
  }
}
