import type { Driver } from '@adapter/spi/MailerSpi'
import type { SentDto, ToSendDto } from '@adapter/spi/dtos/EmailDto'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { Config } from '@domain/services/Mailer'
import { v4 as uuidv4 } from 'uuid'
import nodemailer, { type Transporter } from 'nodemailer'
import SQLite from 'better-sqlite3'
import { SqliteDialect, Kysely } from 'kysely'

// TODO: ne pas créer de nouvelle connection à la base de donnée mais utiliser l'existante (perf Postgres + debug SQlite)

export class MailerDriver implements Driver {
  private transporter: Transporter | SqliteTransporter

  constructor(config: Config) {
    const { host, port, user, pass, secure } = config
    if (user === '_sqlite' && pass === '_sqlite') {
      this.transporter = new SqliteTransporter(host)
    } else {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })
    }
  }

  verify = async () => {
    await this.transporter.verify()
  }

  close = async () => {
    await this.transporter.close()
  }

  send = async (toSendDto: ToSendDto) => {
    const info = await this.transporter.sendMail(toSendDto)
    return {
      id: info.messageId,
      ...toSendDto,
    }
  }

  find = async (filters: FilterDto[]): Promise<SentDto | undefined> => {
    if (this.transporter instanceof SqliteTransporter) {
      return this.transporter.find(filters)
    }
    throw new Error('not implemented')
  }
}

interface SqliteTransporterTable {
  id: string
  to: string
  from: string
  subject: string
  text: string
  html: string
}

interface SqliteTransporterSchema {
  emails: SqliteTransporterTable
}

class SqliteTransporter {
  private db: Kysely<SqliteTransporterSchema>

  constructor(url: string) {
    const dialect = new SqliteDialect({
      database: new SQLite(url),
    })
    this.db = new Kysely<SqliteTransporterSchema>({ dialect })
  }

  verify = async () => {
    await this.db.schema
      .createTable('emails')
      .ifNotExists()
      .addColumn('id', 'text', (col) => col.primaryKey())
      .addColumn('to', 'text')
      .addColumn('from', 'text')
      .addColumn('subject', 'text')
      .addColumn('text', 'text')
      .addColumn('html', 'text')
      .execute()
    return true
  }

  close = async () => {
    await this.db.destroy()
  }

  sendMail = async (toSendDto: ToSendDto) => {
    const { to, from, subject, text, html } = toSendDto
    const id = uuidv4()
    await this.db
      .insertInto('emails')
      .values({
        id,
        to,
        from,
        subject,
        text,
        html,
      })
      .execute()
    return {
      messageId: id,
    }
  }

  find = async (filters: FilterDto[]): Promise<SentDto | undefined> => {
    let query = this.db.selectFrom('emails').selectAll()
    for (const filter of filters) {
      query = query.where(
        filter.field as keyof SqliteTransporterTable,
        filter.operator,
        String(filter.value)
      )
    }
    const email = await query.executeTakeFirst()
    return email
  }
}
