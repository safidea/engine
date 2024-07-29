import type { Driver } from '@adapter/spi/MailerSpi'
import type { SentDto, ToSendDto } from '@adapter/spi/dtos/EmailDto'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { Config } from '@domain/services/Mailer'
import { v4 as uuidv4 } from 'uuid'
import nodemailer, { type Transporter } from 'nodemailer'
import SQLite from 'better-sqlite3'

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

class SqliteTransporter {
  private db: SQLite.Database

  constructor(url: string) {
    this.db = new SQLite(url)
  }

  verify = async () => {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS emails (
        id TEXT PRIMARY KEY,
        "to" TEXT,
        "from" TEXT,
        subject TEXT,
        text TEXT,
        html TEXT
      );
    `)
    return true
  }

  close = async () => {
    this.db.close()
  }

  sendMail = async (toSendDto: ToSendDto) => {
    const { to, from, subject, text, html } = toSendDto
    const id = uuidv4()
    const stmt = this.db.prepare(`
      INSERT INTO emails (id, "to", "from", subject, text, html) VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(id, to, from, subject, text, html)
    return {
      messageId: id,
    }
  }

  find = async (filters: FilterDto[]): Promise<SentDto | undefined> => {
    let query = `SELECT * FROM emails WHERE `
    const conditions: string[] = []
    const values: (string | number)[] = []

    filters.forEach((filter) => {
      if (Array.isArray(filter.value)) {
        conditions.push(
          `"${filter.field}" ${filter.operator} (${filter.value.map(() => '?').join(', ')})`
        )
        values.push(...filter.value)
      } else {
        conditions.push(`"${filter.field}" ${filter.operator} ?`)
        values.push(filter.value)
      }
    })

    query += conditions.join(' AND ')
    const stmt = this.db.prepare(query)
    const email = stmt.get(...values)
    return email as SentDto | undefined
  }
}
