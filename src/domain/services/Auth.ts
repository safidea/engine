import type { Database } from './Database'
import type { Server } from './Server'
import type { Logger } from './Logger'
import type { Post } from '@domain/entities/Request/Post'
import type { Mailer } from './Mailer'
import { CreatedEmail } from '../entities/Email/Created'
import type { TemplateCompiler } from './TemplateCompiler'
import { Json } from '@domain/entities/Response/Json'
import type { Get } from '@domain/entities/Request/Get'
import { Redirect } from '@domain/entities/Response/Redirect'
import type { Template } from './Template'
import type { IdGenerator } from './IdGenerator'

export interface Config {
  redirectOnLogin: string
  redirectOnLogout: string
  strategy: 'magic-link'
  confirmEmail: {
    from: string
    subject: string
    text: string
    html: string
  }
  secret: string
}

export interface Services {
  database: Database
  server: Server
  mailer: Mailer
  logger: Logger
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
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
  private _confirmEmail: { from: string; subject: string; text: Template; html: Template }
  private _loginPath = '/api/auth/login'
  private _verifyMagicLinkPath = '/api/auth/verify-magic-link'

  constructor(
    private _spi: Spi,
    private _services: Services,
    public config: Config
  ) {
    const { server, templateCompiler } = _services
    const { strategy, confirmEmail } = config
    if (strategy === 'magic-link') {
      server.post(this._loginPath, this.sendMagicLink)
      server.get(this._verifyMagicLinkPath, this.verifyMagicLink)
    } else {
      throw new Error(`Unknown strategy: ${strategy}`)
    }
    this._confirmEmail = {
      from: confirmEmail.from,
      subject: confirmEmail.subject,
      text: templateCompiler.compile(confirmEmail.text),
      html: templateCompiler.compile(confirmEmail.html),
    }
  }

  sendMagicLink = async (request: Post) => {
    const { mailer, idGenerator } = this._services
    const email = request.getFromBodyStringOrThrow('email')
    const token = await this._spi.sign({ email }, { expiresIn: '1h' })
    const link = `${request.baseUrl}${this._verifyMagicLinkPath}?token=${token}`
    const createdEmail = new CreatedEmail(
      {
        to: email,
        from: this._confirmEmail.from,
        subject: this._confirmEmail.subject,
        text: this._confirmEmail.text.fillAsString({ link }),
        html: this._confirmEmail.html.fillAsString({ link }),
      },
      { idGenerator }
    )
    const sentEmail = await mailer.send(createdEmail)
    return new Json(sentEmail.toJson())
  }

  verifyMagicLink = async (request: Get) => {
    const { redirectOnLogin, redirectOnLogout } = this.config
    const token = request.getQueryOrThrow('token')
    const isValid = await this._spi.verify(token)
    if (isValid) {
      return new Redirect(redirectOnLogin)
    } else {
      return new Redirect(redirectOnLogout)
    }
  }
}
