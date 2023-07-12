import type { FormConfig, FormField, FormSubmit } from 'shared-component'
import type { AppConfig } from 'shared-app'
import type { TableFieldInterface } from 'shared-table'

class Form {
  private enrichField(
    formField: FormField,
    tableField: TableFieldInterface,
    globalConfig: AppConfig,
    submit: FormSubmit
  ): FormField {
    const { type, table, multiple } = tableField
    switch (type) {
      case 'String':
        formField.type = 'text'
        break
      case 'Decimal':
      case 'Int':
        formField.type = 'number'
        break
      case 'Boolean':
        formField.type = 'checkbox'
        break
      case 'Link':
        if (multiple) {
          formField.type = 'table'
        } else {
          formField.type = 'form'
        }
        formField.table = table
        const { tables } = globalConfig
        if (!tables || !tables[table]) throw new Error(`Table ${table} not found`)
        formField.fields = formField.fields?.map((field) =>
          this.enrichField(field, tables[table].fields[field.key], globalConfig, submit)
        )
        formField.submit = {
          type: submit.type ?? 'create',
        }
        break
      default:
        formField.type = 'text'
        break
    }
    return formField
  }

  public enrich(formConfig: FormConfig, globalConfig: AppConfig): FormConfig {
    const { fields, table, submit } = formConfig
    const { tables } = globalConfig
    if (!tables || !tables[table]) throw new Error(`Table ${table} not found`)
    for (let field of fields) {
      field = this.enrichField(field, tables[table].fields[field.key], globalConfig, submit)
    }
    return {
      ...formConfig,
      fields,
    }
  }
}

export default new Form()
