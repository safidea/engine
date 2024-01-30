type BaseField = {
  name: string
  required?: boolean
}

export type SingleLineTextField = BaseField & {
  type: 'SingleLineText'
}

export type EmailField = BaseField & {
  type: 'Email'
}

export type TableField = SingleLineTextField | EmailField

export interface TableDto {
  name: string
  fields: TableField[]
}
