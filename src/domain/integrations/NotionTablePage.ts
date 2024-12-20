export interface NotionTablePageProperties {
  [key: string]: NotionTablePagePropertyValue
}

export type NotionTablePagePropertyFile = { name: string; url: string }

export type NotionTablePagePropertyValue =
  | string
  | number
  | boolean
  | Date
  | null
  | string[]
  | number[]
  | NotionTablePagePropertyValue[]
  | NotionTablePagePropertyFile[]

export class NotionTablePage {
  constructor(
    public id: string,
    public properties: NotionTablePageProperties,
    public created_time: string,
    public last_edited_time: string,
    public archived: boolean
  ) {}

  getPropertyAsString(key: string): string | null {
    const value = this.properties[key]
    if (!value) return null
    return typeof value === 'string' ? value : value.toString()
  }

  getPropertyAsDate(key: string): Date | null {
    const value = this.properties[key]
    if (!value) return null
    return value instanceof Date ? value : new Date(value.toString())
  }

  getPropertyAsNumber(key: string): number | null {
    const value = this.properties[key]
    if (!value) return null
    return typeof value === 'number' ? value : parseFloat(value.toString())
  }

  getPropertyAsBoolean(key: string): boolean | null {
    const value = this.properties[key]
    if (!value) return null
    return typeof value === 'boolean' ? value : !!value
  }
}
