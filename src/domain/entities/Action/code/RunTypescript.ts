import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { CodeRunner } from '@domain/services/CodeRunner'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import {
  Template,
  type TemplateInputValues,
  type TemplateOutputValue,
} from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface RunTypescriptCodeActionConfig extends BaseActionConfig {
  input?: TemplateInputValues
  code: string
  env?: { [key: string]: string }
}

export interface RunTypescriptCodeActionServices extends BaseActionServices {
  typescriptCompiler: CodeCompiler
  templateCompiler: TemplateCompiler
}

type Input = { [key: string]: TemplateOutputValue }
type Output = object

export class RunTypescriptCodeAction extends BaseAction<Input, Output> {
  private _script: CodeRunner
  private _input: { [key: string]: Template }

  constructor(config: RunTypescriptCodeActionConfig, services: RunTypescriptCodeActionServices) {
    const { env, ...res } = config
    super(res, services)
    const { code, input } = config
    const { typescriptCompiler, templateCompiler } = services
    this._script = typescriptCompiler.compile(code, env ?? {})
    this._input = templateCompiler.compileObjectWithType(input ?? {})
  }

  protected _prepare = async (context: AutomationContext) => {
    return context.fillObjectTemplate(this._input)
  }

  protected _process = async (input: Input) => {
    return this._script.run(input)
  }
}
