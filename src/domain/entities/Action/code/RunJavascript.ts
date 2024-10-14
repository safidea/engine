import { Base, type BaseConfig, type BaseServices } from '../base'
import type { Context } from '../../Automation/Context'
import type { JavascriptRunner } from '@domain/services/JavascriptRunner'
import type { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import { Template, type InputValues, type OutputValue } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Config extends BaseConfig {
  input?: InputValues
  code: string
}

export interface Services extends BaseServices {
  javascriptCompiler: JavascriptCompiler
  templateCompiler: TemplateCompiler
}

type Input = { [key: string]: OutputValue }
type Output = object

export class RunJavascript extends Base<Input, Output> {
  private _script: JavascriptRunner
  private _input: { [key: string]: Template }

  constructor(config: Config, services: Services) {
    super(config, services)
    const { code, input } = config
    const { javascriptCompiler, templateCompiler } = services
    this._script = javascriptCompiler.compile(code)
    this._input = templateCompiler.compileObjectWithType(input ?? {})
  }

  protected _prepare = async (context: Context) => {
    return context.fillObjectTemplate(this._input)
  }

  // TODO: Hidden credentials from the logs
  protected _process = async (input: Input) => {
    return this._script.run(input)
  }
}
