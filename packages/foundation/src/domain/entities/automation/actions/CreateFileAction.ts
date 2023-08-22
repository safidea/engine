import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { BaseAction } from './BaseAction'
import { File } from '@domain/entities/storage/File'
import { IConverterSpi } from '@domain/spi/IConverterSpi'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'
import { AutomationContext } from '../Automation'

export type CreateFileActionInput = 'html'
export type CreateFileActionOutput = 'pdf'
export type CreateFileActionTemplate = string | { privatePath: string }
export type CreateFileActionData = { [key: string]: string }
export type CreateFileActionDataCompiled = { [key: string]: ITemplatingSpi | string }
export type CreateFileActionDataRendered = {
  [key: string]: string | CreateFileActionDataRendered | CreateFileActionDataRendered[]
}

export class CreateFileAction extends BaseAction {
  private _filename: string
  private _filenameCompiled: ITemplatingSpi
  private _template: string
  private _templateCompiled: ITemplatingSpi
  private _dataCompiled: CreateFileActionDataCompiled

  constructor(
    name: string,
    filename: string,
    private _input: CreateFileActionInput,
    private _output: CreateFileActionOutput,
    template: CreateFileActionTemplate,
    private _bucket: string,
    private storage: IStorageSpi,
    private converter: IConverterSpi,
    templating: ITemplatingSpi,
    private _data: CreateFileActionData = {}
  ) {
    super(name, 'create_file')
    this._filename = filename.endsWith(`.${_output}`) ? filename : `${filename}.${_output}`
    this._filenameCompiled = templating.compile(this._filename)
    if (_input === 'html') {
      if (typeof template === 'object' && 'privatePath' in template) {
        this._template = storage.readStaticPrivateFile(template.privatePath)
      } else {
        this._template = template
      }
      this._templateCompiled = templating.compile(this._template)
    } else {
      throw new Error(`Input "${_input}" not supported`)
    }
    this._dataCompiled = Object.entries(_data).reduce(
      (acc: CreateFileActionDataCompiled, [key, value]) => {
        acc[key] = !key.includes('$') ? templating.compile(value) : value
        return acc
      },
      {}
    )
  }

  get filename(): string {
    return this._filename
  }

  get input(): CreateFileActionInput {
    return this._input
  }

  get output(): CreateFileActionOutput {
    return this._output
  }

  get template(): string {
    return this._template
  }

  get bucket(): string {
    return this._bucket
  }

  get data(): CreateFileActionData {
    return this._data
  }

  async execute(context: AutomationContext): Promise<{ [key: string]: AutomationContext }> {
    const filename = this._filenameCompiled.render(context)
    const data = Object.entries(this._dataCompiled).reduce(
      (acc: CreateFileActionDataRendered, [key, value]) => {
        if (typeof value === 'string') {
          if (key.includes('$')) {
            const [rootKey, , arrayKey] = key.split('.')
            let array: CreateFileActionDataRendered[] = []
            const defaultValue = acc[rootKey]
            if (defaultValue && Array.isArray(defaultValue)) {
              array = defaultValue
            }
            const contextPath = value.replace('{{', '').replace('}}', '').trim()
            const [contextRootPath, contextArrayKey] = contextPath.split('.$.')
            const contextValue = super.getValueFromPath(context, contextRootPath)
            if (contextValue && Array.isArray(contextValue)) {
              for (const [index, item] of contextValue.entries()) {
                if (!array[index]) {
                  array[index] = {}
                }
                if (item[contextArrayKey]) {
                  array[index][arrayKey] = item[contextArrayKey]
                }
              }
            }
            acc[rootKey] = array
          } else {
            acc[key] = value
          }
        } else {
          acc[key] = value.render(context)
        }
        return acc
      },
      {}
    )
    const template = this._templateCompiled.render(data)
    const pdfData = await this.converter.htmlToPdf(template)
    const file = new File(filename, pdfData)
    const url = await this.storage.write(this.bucket, file)
    return { [this.name]: { filename, url } }
  }
}
