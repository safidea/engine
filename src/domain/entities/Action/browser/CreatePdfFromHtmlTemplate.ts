import { Base, type Params as BaseParams, type Interface } from '../base'
import type { Context } from '../../Automation/Context'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Browser } from '@domain/services/Browser'
import type { FileSystem } from '@domain/services/FileSystem'
import type { File } from '@domain/entities/File'
import type { Storage } from '@domain/services/Storage'

interface Params extends BaseParams {
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
  fileName: string
  templateCompiler: TemplateCompiler
  browser: Browser
  fileSystem: FileSystem
  file: File
  storage: Storage
}

export class CreatePdfFromHtmlTemplate extends Base implements Interface {
  private _template: Template
  private _input: { [key: string]: Template }

  constructor(private _params: Params) {
    super(_params)
    const { templateCompiler, templatePath, fileSystem, input } = _params
    const templateContent = fileSystem.readText(templatePath)
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
    const { browser, file, storage, fileName } = this._params
    const data = Object.entries(this._input).reduce(
      (acc: { [key: string]: OutputFormat }, [key, value]) => {
        acc[key] = context.fillTemplate(value)
        return acc
      },
      {}
    )
    try {
      const template = this._template.fillAsString(data)
      await browser.launch()
      const page = await browser.newPage()
      const uint8Array = await page.createPdfFromHtml(template)
      await browser.close()
      const file_data = Buffer.from(uint8Array)
      const toSaveFile = file.toSave({ name: fileName, file_data })
      await storage.save(toSaveFile)
      context.set(this.name, { fileId: toSaveFile.id })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`CreatePdfFromHtmlTemplate: ${error.message}`)
      }
      console.error(error)
      throw new Error(`CreatePdfFromHtmlTemplate: unknown error`)
    }
  }
}
