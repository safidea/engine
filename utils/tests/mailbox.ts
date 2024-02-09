import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'
import { Stream } from 'stream'
import Logger from './logger'
import net from 'net'

interface Email {
  to: string
  from: string
  subject: string
  body: string
}

export default class {
  username = 'test@test.com'
  password = 'password'
  private logger: Logger
  private smtpServer: SMTPServer
  private emails: Email[] = []
  private ready = false

  constructor() {
    this.logger = new Logger('mailbox')
    this.smtpServer = new SMTPServer({
      onData: (stream) => this.processEmail(stream),
      onAuth: (auth, session, callback) => {
        if (auth.username !== this.username || auth.password !== this.password) {
          return callback(new Error('invalid username or password'))
        }
        callback(null, { user: 1 })
      },
      logger: false,
    })
  }

  start = async (retry = 0): Promise<void> => {
    try {
      this.logger.log('starting mailbox...')
      const port = await this.getPort()
      await new Promise((resolve, reject) => {
        try {
          this.smtpServer.listen(port, () => resolve(null))
        } catch (err) {
          reject()
        }
      })
      this.ready = true
      this.logger.log('mailbox started on port ' + port)
    } catch (err) {
      if (err instanceof Error && err.message.includes('EADDRINUSE') && retry < 10) {
        return this.start(++retry)
      }
      throw err
    }
  }

  getLastEmail = async (): Promise<Email | undefined> => {
    if (!this.ready) throw new Error('mailbox is not ready')
    if (this.emails.length === 0) return undefined
    return this.emails[this.emails.length - 1]
  }

  private processEmail = (stream: Stream): void => {
    simpleParser(stream, {}, (err: Error, parsed) => {
      if (err) {
        this.logger.log('failed to parse email: ' + err.message)
      }
      const email: Email = {
        to: Array.isArray(parsed.to)
          ? parsed.to.map((to) => to.text).join(', ')
          : parsed.to?.text || '',
        from: parsed.from?.text || '',
        subject: parsed.subject || '',
        body: parsed.text || '',
      }
      this.emails.push(email)
    })
  }

  private getPort = async () => {
    const port: number = await new Promise((resolve, reject) => {
      const srv = net.createServer()
      srv.listen(0, function () {
        const address = srv.address()
        srv.close()
        if (!address || typeof address === 'string') return reject(address)
        resolve(address.port)
      })
    })
    return port
  }
}
