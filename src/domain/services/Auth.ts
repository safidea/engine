import type { Database } from './Database'
import type { Server } from './Server'
import type { Logger } from './Logger'
import type { Post } from '@domain/entities/Request/Post'
import type { Mailer } from './Mailer'
import { ToSend } from '../entities/Email/ToSend'
import type { TemplateCompiler } from './TemplateCompiler'
import { Json } from '@domain/entities/Response/Json'
import type { Get } from '@domain/entities/Request/Get'
import { Redirect } from '@domain/entities/Response/Redirect'

export interface Config {
  redirectOnLogin: string
  redirectOnLogout: string
  strategy: 'magic-link'
  confirmEmail: {
    subject: string
    text: string
    html: string
  }
  secret: string
  from: string
}

export interface Services {
  database: Database
  server: Server
  mailer: Mailer
  logger: Logger
  templateCompiler: TemplateCompiler
}

export interface Payload {
  email: string
}

export interface SignOptions {
  expiresIn: '1h'
}

export interface Spi {
  sign: (payload: Payload, options?: SignOptions) => Promise<string>
  verify: (token: string) => Promise<boolean>
  decode: (token: string) => Promise<Payload>
}

export class Auth {
  private log: (message: string) => void
  loginPath = '/api/auth/login'
  verifyMagicLinkPath = '/api/auth/verify-magic-link'

  constructor(
    private spi: Spi,
    private services: Services,
    public config: Config
  ) {
    const { server, logger } = services
    const { strategy } = config
    this.log = logger.init('auth')
    if (strategy === 'magic-link') {
      server.post(this.loginPath, this.sendMagicLink)
      server.get(this.verifyMagicLinkPath, this.verifyMagicLink)
    } else {
      throw new Error(`Unknown strategy: ${strategy}`)
    }
  }

  connect = async () => {
    this.log('connecting to auth...')
  }

  disconnect = async () => {
    this.log('disconnecting from auth...')
  }

  sendMagicLink = async (request: Post) => {
    const { mailer, templateCompiler } = this.services
    const { confirmEmail, from } = this.config
    const email = request.getFromBodyStringOrThrow('email')
    const token = await this.spi.sign({ email }, { expiresIn: '1h' })
    const link = `${request.baseUrl}${this.verifyMagicLinkPath}?token=${token}`
    const toSend = new ToSend({ to: email, from, ...confirmEmail }, { templateCompiler })
    const sent = await mailer.send(toSend.fill({ link }))
    return new Json(sent.data)
  }

  verifyMagicLink = async (request: Get) => {
    const { redirectOnLogin, redirectOnLogout } = this.config
    const token = request.getQueryOrThrow('token')
    const isValid = await this.spi.verify(token)
    if (isValid) {
      return new Redirect(redirectOnLogin)
    } else {
      return new Redirect(redirectOnLogout)
    }
  }
}
