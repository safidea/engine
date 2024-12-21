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

  getTitle(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getCheckbox(name: string): boolean | null {
    return this._getPropertyAsBoolean(name)
  }

  getCreatedBy(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getCreatedTime(name: string): Date | null {
    return this._getPropertyAsDate(name)
  }

  getDate(name: string): Date | null {
    return this._getPropertyAsDate(name)
  }

  getEmail(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getFiles(name: string): NotionTablePagePropertyFile[] | null {
    const value = this.properties[name]
    if (!value) return null
    if (!NotionTablePage.isFilesProperty(value)) return null
    return value
  }

  getStringFormula(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getNumberFormula(name: string): number | null {
    return this._getPropertyAsNumber(name)
  }

  getBooleanFormula(name: string): boolean | null {
    return this._getPropertyAsBoolean(name)
  }

  getDateFormula(name: string): Date | null {
    return this._getPropertyAsDate(name)
  }

  getLastEditedBy(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getLastEditedTime(name: string): Date | null {
    return this._getPropertyAsDate(name)
  }

  getMultiSelect(name: string): string[] | null {
    return this._getPropertyAsStringArray(name)
  }

  getNumber(name: string): number | null {
    return this._getPropertyAsNumber(name)
  }

  getPeople(name: string): string[] | null {
    return this._getPropertyAsStringArray(name)
  }

  getPhone(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getRelations(name: string): string[] | null {
    return this._getPropertyAsStringArray(name)
  }

  getStringArrayRollup(name: string): string[] | null {
    return this._getPropertyAsStringArray(name)
  }

  getNumberArrayRollup(name: string): number[] | null {
    const value = this.properties[name]
    if (!value) return null
    if (!Array.isArray(value)) return null
    return value.every((item) => typeof item === 'number') ? value : null
  }

  getBooleanArrayRollup(name: string): boolean[] | null {
    const value = this.properties[name]
    if (!value) return null
    if (!Array.isArray(value)) return null
    return value.every((item) => typeof item === 'boolean') ? value : null
  }

  getDateRollup(name: string): Date | null {
    return this._getPropertyAsDate(name)
  }

  getNumberRollup(name: string): number | null {
    return this._getPropertyAsNumber(name)
  }

  getRichText(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getSelect(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getUrl(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getStatus(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  private _getPropertyAsString(name: string): string | null {
    const value = this.properties[name]
    if (!value) return null
    return typeof value === 'string' ? value : value.toString()
  }

  private _getPropertyAsStringArray(name: string): string[] | null {
    const value = this.properties[name]
    if (!value) return null
    if (!NotionTablePage.isStringArrayProperty(value)) return null
    return value
  }

  private _getPropertyAsDate(name: string): Date | null {
    const value = this.properties[name]
    if (!value) return null
    return value instanceof Date ? value : new Date(value.toString())
  }

  private _getPropertyAsNumber(name: string): number | null {
    const value = this.properties[name]
    if (!value) return null
    return typeof value === 'number' ? value : parseFloat(value.toString())
  }

  private _getPropertyAsBoolean(name: string): boolean | null {
    const value = this.properties[name]
    if (value == undefined) return null
    return typeof value === 'boolean' ? value : !!value
  }

  static isFilesProperty = (
    value: NotionTablePagePropertyValue
  ): value is NotionTablePagePropertyFile[] => {
    return (
      Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          'name' in item &&
          'url' in item &&
          typeof item.name === 'string' &&
          typeof item.url === 'string'
      )
    )
  }

  static isStringArrayProperty = (value: NotionTablePagePropertyValue): value is string[] => {
    return Array.isArray(value) && value.every((item) => typeof item === 'string')
  }
}
