import { Base, type BaseConfig, type BaseServices } from '../base'
import type { Mailer } from '@domain/services/Mailer'
import type { Context } from '../../Automation/Context'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import { CreatedEmail } from '@domain/entities/Email/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { EmailJson } from '@domain/entities/Email/base'

export interface Config extends BaseConfig {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export interface Services extends BaseServices {
  mailer: Mailer
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

type Input = {
  from: string
  to: string
  subject: string
  text: string
  html: string
}
type Output = EmailJson

export class SendEmail extends Base<Input, Output> {
  private _from: Template
  private _to: Template
  private _subject: Template
  private _text: Template
  private _html: Template

  constructor(
    config: Config,
    private _services: Services
  ) {
    super(config, _services)
    const { from, to, subject, text, html } = config
    const { templateCompiler } = _services
    this._from = templateCompiler.compile(from)
    this._to = templateCompiler.compile(to)
    this._subject = templateCompiler.compile(subject)
    this._text = templateCompiler.compile(text)
    this._html = templateCompiler.compile(html)
  }

  protected _prepare = async (context: Context) => {
    return {
      from: context.fillTemplateAsString(this._from),
      to: context.fillTemplateAsString(this._to),
      subject: context.fillTemplateAsString(this._subject),
      text: context.fillTemplateAsString(this._text),
      html: context.fillTemplateAsString(this._html),
    }
  }

  protected _process = async (input: Input) => {
    const { mailer, idGenerator } = this._services
    const emailSent = await mailer.send(new CreatedEmail(input, { idGenerator }))
    return emailSent.toJson()
  }
}
