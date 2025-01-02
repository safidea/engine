import Logger from './logger'
import { MailerDriver } from '@infrastructure/drivers/node/MailerDriver'
import type { MailerConfig } from '@domain/services/Mailer'
import { join } from 'path'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'
import { DatabaseDriver } from '@infrastructure/drivers/node/DatabaseDriver'
import type { FilterDto } from '@domain/entities/Filter'
import type { EmailDto } from '@adapter/spi/dtos/EmailDto'

export default class extends MailerDriver {
  public config: MailerConfig
  private _database: DatabaseDriver

  constructor() {
    const logger = new Logger()
    logger.debug(`creating test mailbox...`)
    const host = join(process.cwd(), 'tmp', `mailbox-${nanoid()}.db`)
    fs.ensureFileSync(host)
    const config = {
      host,
      port: '0',
      user: '_sqlite',
      pass: '_sqlite',
      from: 'noreply@localhost',
    }
    super(config)
    this.config = config
    this._database = new DatabaseDriver({ url: host, driver: 'SQLite' })
    logger.debug(`test mailbox created`)
  }

  get emails() {
    return this._database.table('emails', [
      {
        name: 'id',
        type: 'TEXT',
      },
      {
        name: 'from',
        type: 'TEXT',
      },
      {
        name: 'to',
        type: 'TEXT',
      },
      {
        name: 'subject',
        type: 'TEXT',
      },
      {
        name: 'text',
        type: 'TEXT',
      },
      {
        name: 'html',
        type: 'TEXT',
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
      },
    ])
  }

  waitForEmail = async (filter: FilterDto): Promise<EmailDto> => {
    let email: EmailDto | undefined
    while (!email) {
      email = await this.find(filter)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    return email
  }
}
