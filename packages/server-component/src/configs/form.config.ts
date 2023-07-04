import type { FormConfig } from 'shared-component'
import type { AppConfig } from 'shared-app'

class Form {
  enrich(formConfig: FormConfig, globalConfig: AppConfig): FormConfig {
    const { fields, table } = formConfig
    const { tables } = globalConfig
    if (tables) {
      for (const field of fields) {
        const { type } = tables[table].fields[field.key]
        switch (type) {
          case 'String':
            field.type = 'text'
            break
          case 'Decimal':
          case 'Int':
            field.type = 'number'
            break
          case 'Boolean':
            field.type = 'checkbox'
            break
          default:
            field.type = 'text'
            break
        }
      }
    }
    return {
      ...formConfig,
      fields,
    }
  }
}

export default new Form()
