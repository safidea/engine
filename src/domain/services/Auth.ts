import type { Database } from './Database'
import type { Server } from './Server'
import type { Logger } from './Logger'
import type { Post } from '@domain/entities/request/Post'
import type { Mailer } from './Mailer'
import { ToSend } from '../entities/email/ToSend'
import type { TemplateCompiler } from './TemplateCompiler'
import { Json } from '@domain/entities/response/Json'
import type { Get } from '@domain/entities/request/Get'
import { Redirect } from '@domain/entities/response/Redirect'

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
}

export interface Params extends Config {
  from: string
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
  params: Params
  sign: (payload: Payload, options?: SignOptions) => Promise<string>
  verify: (token: string) => Promise<boolean>
  decode: (token: string) => Promise<Payload>
}

export class Auth {
  loginPath = '/api/auth/login'
  verifyMagicLinkPath = '/api/auth/verify-magic-link'

  constructor(private spi: Spi) {
    const { server, strategy } = spi.params
    if (strategy === 'magic-link') {
      server.post(this.loginPath, this.sendMagicLink)
      server.get(this.verifyMagicLinkPath, this.verifyMagicLink)
    } else {
      throw new Error(`Unknown strategy: ${strategy}`)
    }
  }

  connect = async () => {
    const { logger } = this.spi.params
    logger.log('connecting to auth...')
  }

  disconnect = async () => {
    const { logger } = this.spi.params
    logger.log('disconnecting from auth...')
  }

  sendMagicLink = async (request: Post) => {
    const { mailer, confirmEmail, templateCompiler, from } = this.spi.params
    const email = request.getFromBodyStringOrThrow('email')
    const token = await this.spi.sign({ email }, { expiresIn: '1h' })
    const link = `${request.baseUrl}${this.verifyMagicLinkPath}?token=${token}`
    const toSend = new ToSend({ to: email, from, ...confirmEmail }, { templateCompiler })
    const sent = await mailer.send(toSend.fill({ link }))
    return new Json(sent.data)
  }

  verifyMagicLink = async (request: Get) => {
    const { redirectOnLogin, redirectOnLogout } = this.spi.params
    const token = request.getQueryOrThrow('token')
    const isValid = await this.spi.verify(token)
    if (isValid) {
      return new Redirect(redirectOnLogin)
    } else {
      return new Redirect(redirectOnLogout)
    }
  }
}
