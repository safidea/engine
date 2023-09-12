import { BaseAction } from '../../base/BaseAction'
import { File } from '@entities/drivers/storage/File'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { AppDrivers } from '@entities/app/App'
import { CreateFileActionOptions } from './CreateFileActionOptions'

type DataCompiled = { [key: string]: ITemplatingSpi | string }
type DataRendered = {
  [key: string]: string | DataRendered | DataRendered[]
}

export class CreateFileAction extends BaseAction {
  private bucket: string
  private filename: string
  private filenameCompiled: ITemplatingSpi
  private template: string
  private templateCompiled: ITemplatingSpi
  private dataCompiled: DataCompiled

  constructor(options: CreateFileActionOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { name, type, filename, input, output, template, bucket, data } = options
    const { storage, templater } = drivers
    super({ name, type }, drivers, config)
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
    const pdfData = await this.drivers.converter.htmlToPdf(template)
    const file = new File(filename, pdfData)
    const url = await this.drivers.storage.write(this.bucket, file)
    return { [this.name]: { filename, url } }
  }
}
