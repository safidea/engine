import { Base, type BaseConfig } from '../base'
import type { Mailer } from '@domain/services/Mailer'
import type { Context } from '../../Automation/Context'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import { CreatedEmail } from '@domain/entities/Email/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'

export interface Config extends BaseConfig {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export interface Services {
  mailer: Mailer
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export class SendEmail extends Base {
  private _from: Template
  private _to: Template
  private _subject: Template
  private _text: Template
  private _html: Template

  constructor(
    config: Config,
    private _services: Services
  ) {
    super(config)
    const { from, to, subject, text, html } = config
    const { templateCompiler } = _services
    this._from = templateCompiler.compile(from)
    this._to = templateCompiler.compile(to)
    this._subject = templateCompiler.compile(subject)
    this._text = templateCompiler.compile(text)
    this._html = templateCompiler.compile(html)
  }

  execute = async (context: Context) => {
    const { mailer, idGenerator } = this._services
    const toSendEmail = new CreatedEmail(
      {
        from: context.fillTemplateAsString(this._from),
        to: context.fillTemplateAsString(this._to),
        subject: context.fillTemplateAsString(this._subject),
        text: context.fillTemplateAsString(this._text),
        html: context.fillTemplateAsString(this._html),
      },
      { idGenerator }
    )
    const emailSent = await mailer.send(toSendEmail)
    context.set(this.name, emailSent.toJson())
  }
}
