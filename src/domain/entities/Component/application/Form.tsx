import type { Server } from '@domain/services/Server'
import type { Base, BaseProps, BaseServices } from '../base'
import type { PostRequest } from '@domain/entities/Request/Post'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Response } from '@domain/entities/Response'
import { HtmlResponse } from '@domain/entities/Response/Html'
import type { RequestMethod } from '@domain/entities/Request'
import type { Title } from '../content/Title'
import type { Paragraph } from '../content/Paragraph'
import type { Input } from '../base/Input'
import type { Button } from '../base/Button'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as InputsProps } from '../base/Input'
import type { Props as ButtonProps } from '../base/Button'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import { PageState } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  formId: string
  action: string
  method?: RequestMethod
  Title?: React.FC<Partial<TitleProps>>
  Paragraph?: React.FC<Partial<ParagraphProps>>
  Inputs: React.FC<Partial<InputsProps>>[]
  Buttons: React.FC<Partial<ButtonProps>>[]
  successMessage?: string
  errorMessage?: string
}

export interface Config
  extends Omit<Props, 'formId' | 'Title' | 'Paragraph' | 'Inputs' | 'Buttons' | 'errorMessage'> {
  source?: string
}

export interface Services extends BaseServices {
  server: Server
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export interface Entities {
  title?: Title
  paragraph?: Paragraph
  inputs: Input[]
  buttons: Button[]
}

export class Form implements Base<Props> {
  private _id: string
  private _path: string
  private _action: Template
  private _source?: Template

  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    const { action, source } = _config
    const { templateCompiler, idGenerator } = _services
    this._id = idGenerator.forComponent()
    this._path = `/api/component/form/${this._id}`
    this._action = templateCompiler.compile(action)
    if (source) this._source = templateCompiler.compile(source)
  }

  init = async () => {
    const { title, paragraph, inputs, buttons } = this._entities
    const { server } = this._services
    await Promise.all([
      server.post(this._path, this.post),
      title?.init(),
      paragraph?.init(),
      ...inputs.map((input) => input.init()),
      ...buttons.map((button) => button.init()),
    ])
  }

  getData = async (state: PageState) => {
    const { server } = this._services
    if (this._source && server.baseUrl) {
      const filledSource = state.fillTemplate(this._source)
      const url = filledSource.startsWith('/api/table/')
        ? server.baseUrl + filledSource
        : filledSource
      const { record = {} } = await fetch(url).then((res) => res.json())
      return record
    }
    return {}
  }

  post = async (request: PostRequest): Promise<Response> => {
    const state = new PageState(request)
    const { server } = this._services
    const { method = 'POST', successMessage } = this._config
    const filledAction = state.fillTemplate(this._action)
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
      return new HtmlResponse(html)
    } else {
      const errorMessage = await result.text()
      const html = await this.html(state, { errorMessage })
      return new HtmlResponse(html)
    }
  }

  html = async (state: PageState, props?: Partial<Props>) => {
    const { client } = this._services
    const Component = await this.render(state)
    return client.renderToHtml(<Component {...props} />)
  }

  render = async (state: PageState) => {
    const { client } = this._services
    const { title, paragraph, inputs, buttons } = this._entities
    const { id, className } = this._config
    const record = await this.getData(state)
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Title = title ? await title.render() : undefined
    const Paragraph = paragraph ? await paragraph.render() : undefined
    const Inputs = await Promise.all(
      inputs.map((input) => input.render(state, { defaultValue: record[input.name] }))
    )
    const action = state.addQueryToPath(this._path)
    const Component = client.components.Form
    return (props?: Partial<Props>) => (
      <client.Frame id={this._id}>
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
            formId: 'form-' + this._id,
            ...props,
          }}
        />
      </client.Frame>
    )
  }

  validateConfig = () => {
    const { title, paragraph, inputs, buttons } = this._entities
    const errors: ConfigError[] = []
    if (title) errors.push(...title.validateConfig())
    if (paragraph) errors.push(...paragraph.validateConfig())
    inputs.forEach((input) => errors.push(...input.validateConfig()))
    buttons.forEach((button) => errors.push(...button.validateConfig()))
    return errors
  }
}
