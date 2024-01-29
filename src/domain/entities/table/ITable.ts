type IBaseField = {
  name: string
  required?: boolean
}

export type ISingleLineTextField = IBaseField & {
  type: 'SingleLineText'
}

export type IEmailField = IBaseField & {
  type: 'Email'
}

export type ITableField = ISingleLineTextField | IEmailField

export interface ITable {
  name: string
  fields: ITableField[]
}
