import type { Server } from '@domain/services/Server'
import type { Base, ReactComponent, BaseProps } from '../base/base'
import type { Post } from '@domain/entities/request/Post'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Response } from '@domain/entities/response'
import { Html } from '@domain/entities/response/Html'
import type { Ui } from '@domain/services/Ui'
import type { Client } from '@domain/services/Client'
import type { Method } from '@domain/entities/request'
import type { Title } from '../content/Title'
import type { Paragraph } from '../content/Paragraph'
import type { Input } from '../base/Input'
import type { Button } from '../base/Button'
import type { ConfigError } from '@domain/entities/error/Config'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as InputsProps } from '../base/Input'
import type { Props as ButtonProps } from '../base/Button'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import { State } from '../../State'

export interface Props extends BaseProps {
  formId: string
  action: string
  method?: Method
  Title?: React.FC<Partial<TitleProps>>
  Paragraph?: React.FC<Partial<ParagraphProps>>
  Inputs: React.FC<Partial<InputsProps>>[]
  Buttons: React.FC<Partial<ButtonProps>>[]
  successMessage?: string
  errorMessage?: string
}

interface Params
  extends Omit<Props, 'formId' | 'Title' | 'Paragraph' | 'Inputs' | 'Buttons' | 'errorMessage'> {
  title?: Title
  paragraph?: Paragraph
  inputs: Input[]
  buttons: Button[]
  source?: string
  Component: ReactComponent<Props>
  server: Server
  idGenerator: IdGenerator
  ui: Ui
  client: Client
  templateCompiler: TemplateCompiler
}

export class Form implements Base<Props> {
  private id: string
  private path: string
  private action: Template
  private source?: Template

  constructor(private params: Params) {
    const { action, source, idGenerator, templateCompiler } = params
    this.id = idGenerator.forComponent()
    this.path = `/api/component/form/${this.id}`
    this.action = templateCompiler.compile(action)
    if (source) this.source = templateCompiler.compile(source)
  }

  init = async () => {
    const { server, title, paragraph, inputs, buttons } = this.params
    await Promise.all([
      server.post(this.path, this.post),
      title?.init(),
      paragraph?.init(),
      ...inputs.map((input) => input.init()),
      ...buttons.map((button) => button.init()),
    ])
  }

  getData = async (state: State) => {
    const { server } = this.params
    if (this.source && server.baseUrl) {
      const filledSource = state.fillTemplate(this.source)
      const url = filledSource.startsWith('/api/table/')
        ? server.baseUrl + filledSource
        : filledSource
      const { record = {} } = await fetch(url).then((res) => res.json())
      return record
    }
    return {}
  }

  post = async (request: Post): Promise<Response> => {
    const state = new State(request)
    const { method = 'POST', successMessage, server } = this.params
    const filledAction = state.fillTemplate(this.action)
    const url = filledAction.startsWith('/') ? server.baseUrl + filledAction : filledAction
    const result = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    })
    if (result.ok) {
      const html = await this.html(state, { successMessage })
      return new Html(html)
    } else {
      const errorMessage = await result.text()
      const html = await this.html(state, { errorMessage })
      return new Html(html)
    }
  }

  html = async (state: State, props?: Partial<Props>) => {
    const { ui } = this.params
    const Component = await this.render(state)
    return ui.renderToHtml(<Component {...props} />)
  }

  render = async (state: State) => {
    const { client, Component, title, paragraph, inputs, buttons, id, className } = this.params
    const record = await this.getData(state)
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Title = title ? await title.render() : undefined
    const Paragraph = paragraph ? await paragraph.render() : undefined
    const Inputs = await Promise.all(
      inputs.map((input) => input.render(state, { defaultValue: record[input.name] }))
    )
    const action = state.addQueryToPath(this.path)
    return (props?: Partial<Props>) => (
      <client.Frame id={this.id}>
        <Component
          {...{
            id,
            className,
            action,
            method: 'POST',
            Title,
            Paragraph,
            Inputs,
            Buttons,
            formId: 'form-' + this.id,
            ...props,
          }}
        />
      </client.Frame>
    )
  }

  validateConfig = () => {
    const { title, paragraph, inputs, buttons } = this.params
    const errors: ConfigError[] = []
    if (title) errors.push(...title.validateConfig())
    if (paragraph) errors.push(...paragraph.validateConfig())
    inputs.forEach((input) => errors.push(...input.validateConfig()))
    buttons.forEach((button) => errors.push(...button.validateConfig()))
    return errors
  }
}
