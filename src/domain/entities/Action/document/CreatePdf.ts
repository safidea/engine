/*import { Base, type Params as BaseParams, type Interface } from './base'
import type { Context } from '../Automation/Context'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Browser } from '@domain/services/Browser'

interface Params extends BaseParams {
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
  templateCompiler: TemplateCompiler
  browser: Browser
  fileSystem: FileSystem
}

export class CreatePdf extends Base implements Interface {
  private _browser: Browser
  private _template: Template
  private _input: { [key: string]: Template }

  constructor(params: Params) {
    super(params)
    const { browser, templateCompiler, templatePath, fileSystem, input } = params
    this._browser = browser
    const templateContent = fileSystem.read(templatePath)
    this._template = templateCompiler.compile(templateContent)
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
      const template = this._template.fillAsString(data)
      await this._browser.launch()
      const page = await this._browser.newPage()
      const buffer = await page.createPdf(template)
      await this._browser.close()
      const url = `data:application/pdf;base64,${buffer.toString('base64')}`
      context.set(this.name, { url })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`CreatePdf: ${error.message}`)
      }
      console.error(error)
      throw new Error(`CreatePdf: unknown error`)
    }
  }
}
*/
