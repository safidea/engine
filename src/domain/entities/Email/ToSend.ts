import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Context } from '../Automation/Context'
import type { Template } from '@domain/services/Template'

export interface Data {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export interface Params {
  templateCompiler: TemplateCompiler
}

export class ToSend {
  public from: Template
  private to: Template
  private subject: Template
  private text: Template
  private html: Template

  constructor(
    public data: Data,
    private _params: Params
  ) {
    const { templateCompiler } = _params
    this.from = templateCompiler.compile(data.from)
    this.to = templateCompiler.compile(data.to)
    this.subject = templateCompiler.compile(data.subject)
    this.text = templateCompiler.compile(data.text)
    this.html = templateCompiler.compile(data.html)
  }

  fill = (data: Record<string, unknown>): ToSend => {
    const filledData = {
      from: this.from.fillAsString(data),
      to: this.to.fillAsString(data),
      subject: this.subject.fillAsString(data),
      text: this.text.fillAsString(data),
      html: this.html.fillAsString(data),
    }
    return new ToSend(filledData, this._params)
  }

  fillWithContext = (context: Context): ToSend => {
    const data = {
      from: context.fillTemplateAsString(this.from),
      to: context.fillTemplateAsString(this.to),
      subject: context.fillTemplateAsString(this.subject),
      text: context.fillTemplateAsString(this.text),
      html: context.fillTemplateAsString(this.html),
    }
    return new ToSend(data, this._params)
  }
}
