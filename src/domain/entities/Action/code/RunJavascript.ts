import { Base, type Params as BaseParams, type Interface } from '../base'
import type { Context } from '../../Automation/Context'
import type { JavascriptRunner } from '@domain/services/JavascriptRunner'
import type { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Params extends BaseParams {
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  code: string
  javascriptCompiler: JavascriptCompiler
  templateCompiler: TemplateCompiler
}

export class RunJavascript extends Base implements Interface {
  private _script: JavascriptRunner
  private _input: { [key: string]: Template }

  constructor(params: Params) {
    super(params)
    const { javascriptCompiler, templateCompiler, code, input } = params
    this._script = javascriptCompiler.compile(code)
    this._input = Object.entries(input ?? {}).reduce(
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
    try {
      const result = await this._script.run(data)
      context.set(this.name, result)
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw new Error(`RunJavascript: ${error.message}`)
      }
      console.error(error)
      throw new Error(`RunJavascript: unknown error`)
    }
  }
}
