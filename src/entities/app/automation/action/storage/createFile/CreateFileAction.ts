import { BaseAction } from '../../base/BaseAction'
import { File } from '@entities/services/storage/file/File'
import { ITemplaterService } from '@entities/services/templater/ITemplaterService'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { AppServices } from '@entities/app/App'
import { CreateFileActionParams } from './CreateFileActionParams'

type DataCompiled = { [key: string]: ITemplaterService | string }
type DataRendered = {
  [key: string]: string | DataRendered | DataRendered[]
}

export class CreateFileAction extends BaseAction {
  private bucket: string
  private filename: string
  private filenameCompiled: ITemplaterService
  private template: string
  private templateCompiled: ITemplaterService
  private dataCompiled: DataCompiled

  constructor(params: CreateFileActionParams, services: AppServices, config: AutomationConfig) {
    const { name, type, filename, input, output, template, bucket, data } = params
    const { storage, templater } = services
    super({ name, type }, services, config)
    this.bucket = bucket
    this.filename = filename.endsWith(`.${output}`) ? filename : `${filename}.${output}`
    this.filenameCompiled = templater.compile(this.filename)
    if (input === 'html') {
      if (typeof template === 'object' && 'path' in template) {
        this.template = storage.readStaticFile(template.path)
      } else {
        this.template = template
      }
      this.templateCompiled = templater.compile(this.template)
    } else {
      this.throwError(`Input "${input}" not supported`)
    }
    this.dataCompiled = Object.entries(data).reduce((acc: DataCompiled, [key, value]) => {
      acc[key] = !key.includes('$') ? templater.compile(value) : value
      return acc
    }, {})
  }

  async execute(context: AutomationContext): Promise<{ [key: string]: AutomationContext }> {
    const filename = this.filenameCompiled.render(context)
    const data = Object.entries(this.dataCompiled).reduce((acc: DataRendered, [key, value]) => {
      if (typeof value === 'string') {
        if (key.includes('$')) {
          const [rootKey, , arrayKey] = key.split('.')
          let array: DataRendered[] = []
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
    }, {})
    const template = this.templateCompiled.render(data)
    const pdfData = await this.services.converter.htmlToPdf(template, this.config.tmpFolder)
    const file = new File(pdfData, { filename })
    const url = await this.services.storage.upload(this.bucket, file)
    return { [this.name]: { filename, url } }
  }
}
