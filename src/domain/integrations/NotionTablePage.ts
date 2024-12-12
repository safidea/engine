export interface NotionTablePageProperties {
  [key: string]: NotionTablePagePropertyValue
}

export type NotionTablePagePropertyValue =
  | string
  | number
  | boolean
  | Date
  | null
  | string[]
  | number[]
  | NotionTablePagePropertyValue[]
  | { name: string; url: string }[]

export class NotionTablePage {
  constructor(
    public id: string,
    public properties: NotionTablePageProperties,
    public created_time: string,
    public last_edited_time: string
  ) {}

  getPropertyAsString(key: string): string | null {
    const value = this.properties[key]
    return value ? String(value) : null
  }
}
