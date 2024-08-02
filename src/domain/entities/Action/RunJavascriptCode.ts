import { Base, type Params as BaseParams, type Interface } from './base'
import type { Context } from '../Automation/Context'
import type { CodeRunner } from '@domain/services/CodeRunner'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Params extends BaseParams {
  input: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  code: string
  codeCompiler: CodeCompiler
  templateCompiler: TemplateCompiler
}

export class RunJavascriptCode extends Base implements Interface {
  private _codeRunner: CodeRunner
  private _input: { [key: string]: Template }

  constructor(params: Params) {
    super(params)
    const { codeCompiler, templateCompiler, code } = params
    this._codeRunner = codeCompiler.compile(code)
    this._input = Object.entries(params.input).reduce(
      (acc: { [key: string]: Template }, [key, { value, type }]) => {
        acc[key] = templateCompiler.compile(value, type)
        return acc
      },
      {}
    )
  }

  execute = async (context: Context) => {
    const data = Object.entries(this._input).reduce(
      (acc: { [key: string]: OutputFormat }, [key, value]) => {
        acc[key] = context.fillTemplate(value)
        return acc
      },
      {}
    )
    const result = await this._codeRunner.run(data)
    context.set(this.name, result)
  }
}
