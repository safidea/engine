import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { CodeRunner } from '@domain/services/CodeRunner'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import {
  Template,
  type TemplateObject,
  type TemplateObjectCompiled,
  type TemplateObjectFilled,
} from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface RunJavascriptCodeActionConfig extends BaseActionConfig {
  code: string
  input?: TemplateObject
  env?: { [key: string]: string }
}

export interface RunJavascriptCodeActionServices extends BaseActionServices {
  javascriptCompiler: CodeCompiler
  templateCompiler: TemplateCompiler
}

type Input = TemplateObjectFilled
type Output = object

export class RunJavascriptCodeAction extends BaseAction<Input, Output> {
  private _script: CodeRunner
  private _input: TemplateObjectCompiled

  constructor(config: RunJavascriptCodeActionConfig, services: RunJavascriptCodeActionServices) {
    const { env, ...res } = config
    super(res, services)
    const { code, input } = config
    const { javascriptCompiler, templateCompiler } = services
    this._script = javascriptCompiler.compile(code, env ?? {})
    this._input = templateCompiler.compileObject(input ?? {})
  }

  protected _prepare = async (context: AutomationContext) => {
    return Template.fillObject(this._input, context.data)
  }

  protected _process = async (input: Input) => {
    return this._script.run(input)
  }
}
