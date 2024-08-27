import { Base, type Params as BaseParams, type Interface } from '../base'
import type { Context } from '../../Automation/Context'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { ConfigError } from '@domain/entities/Error/Config'
import type { Zip } from '@domain/services/Zip'
import type { Bucket } from '@domain/entities/Bucket'

interface Params extends BaseParams {
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
  templateCompiler: TemplateCompiler
  fileName: string
  bucket: Bucket
  zip: Zip
}

export class CreateDocxFromTemplate extends Base implements Interface {
  private _template: Template
  private _input: { [key: string]: Template }

  constructor(private _params: Params) {
    super(_params)
    const { templateCompiler, templatePath, input, zip } = _params
    if (!templatePath.endsWith('.docx'))
      throw new ConfigError({
        message: 'CreateDocxFromTemplate: templatePath must be a .docx file',
      })
    const templateContent = zip.readDocx(templatePath)
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
    const { fileName, zip, templatePath, bucket } = this._params
    const data = Object.entries(this._input).reduce(
      (acc: { [key: string]: OutputFormat }, [key, value]) => {
        acc[key] = context.fillTemplate(value)
        return acc
      },
      {}
    )
    try {
      const document = this._template.fillAsString(data)
      const fileData = zip.updateDocx(templatePath, document)
      const fileToSave = bucket.file
        .toSave({ name: fileName, file_data: fileData })
        .fillWithContext(context)
      await bucket.storage.save(fileToSave)
      context.set(this.name, { fileId: fileToSave.id })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`CreateDocxFromTemplate: ${error.message}`)
      }
      console.error(error)
      throw new Error(`CreateDocxFromTemplate: unknown error`)
    }
  }
}
