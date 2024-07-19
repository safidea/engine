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
    private params: Params
  ) {
    const { templateCompiler } = params
    this.from = templateCompiler.compile(data.from)
    this.to = templateCompiler.compile(data.to)
    this.subject = templateCompiler.compile(data.subject)
    this.text = templateCompiler.compile(data.text)
    this.html = templateCompiler.compile(data.html)
  }

  fill = (data: Record<string, unknown>): ToSend => {
    const filledData = {
      from: this.from.fill(data),
      to: this.to.fill(data),
      subject: this.subject.fill(data),
      text: this.text.fill(data),
      html: this.html.fill(data),
    }
    return new ToSend(filledData, this.params)
  }

  fillWithContext = (context: Context): ToSend => {
    const data = {
      from: context.fillTemplate(this.from),
      to: context.fillTemplate(this.to),
      subject: context.fillTemplate(this.subject),
      text: context.fillTemplate(this.text),
      html: context.fillTemplate(this.html),
    }
    return new ToSend(data, this.params)
  }
}
