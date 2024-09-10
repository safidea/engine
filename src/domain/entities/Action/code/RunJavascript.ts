import { Base, type BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'
import type { JavascriptRunner } from '@domain/services/JavascriptRunner'
import type { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import { Template, type InputValues } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Config extends BaseConfig {
  input?: InputValues
  code: string
}

export interface Services {
  javascriptCompiler: JavascriptCompiler
  templateCompiler: TemplateCompiler
}

export class RunJavascript extends Base {
  private _script: JavascriptRunner
  private _input: { [key: string]: Template }

  constructor(config: Config, services: Services) {
    super(config)
    const { code, input } = config
    const { javascriptCompiler, templateCompiler } = services
    this._script = javascriptCompiler.compile(code)
    this._input = templateCompiler.compileObjectWithType(input ?? {})
  }

  execute = async (context: Context) => {
    const data = context.fillObjectTemplate(this._input)
    const result = await this._script.run(data)
    context.set(this.name, result)
  }
}
