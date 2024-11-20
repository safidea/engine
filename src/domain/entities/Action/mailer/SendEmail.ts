import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { Mailer } from '@domain/services/Mailer'
import type { AutomationContext } from '../../Automation/Context'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import { CreatedEmail } from '@domain/entities/Email/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { EmailJson } from '@domain/entities/Email/base'

export interface SendEmailMailerActionConfig extends BaseActionConfig {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export interface SendEmailMailerActionServices extends BaseActionServices {
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

export class SendEmailMailerAction extends BaseAction<Input, Output> {
  private _from: Template
  private _to: Template
  private _subject: Template
  private _text: Template
  private _html: Template

  constructor(
    config: SendEmailMailerActionConfig,
    private _services: SendEmailMailerActionServices
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

  protected _prepare = async (context: AutomationContext) => {
    return {
      from: this._from.fill(context.data),
      to: this._to.fill(context.data),
      subject: this._subject.fill(context.data),
      text: this._text.fill(context.data),
      html: this._html.fill(context.data),
    }
  }

  protected _process = async (input: Input) => {
    const { mailer, idGenerator } = this._services
    const emailSent = await mailer.send(new CreatedEmail(input, { idGenerator }))
    return emailSent.toJson()
  }
}
