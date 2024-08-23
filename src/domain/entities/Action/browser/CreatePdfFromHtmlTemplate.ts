import { Base, type Params as BaseParams, type Interface } from '../base'
import type { Context } from '../../Automation/Context'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Browser } from '@domain/services/Browser'
import type { FileSystem } from '@domain/services/FileSystem'
import type { Bucket } from '@domain/entities/Bucket'

interface Params extends BaseParams {
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
  fileName: string
  bucket: Bucket
  templateCompiler: TemplateCompiler
  browser: Browser
  fileSystem: FileSystem
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
    const { browser, bucket, fileName } = this._params
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
      const fileToSave = bucket.file.toSave({ name: fileName, file_data }).fillWithContext(context)
      await bucket.storage.save(fileToSave)
      context.set(this.name, { fileId: fileToSave.id })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`CreatePdfFromHtmlTemplate: ${error.message}`)
      }
      console.error(error)
      throw new Error(`CreatePdfFromHtmlTemplate: unknown error`)
    }
  }
}
