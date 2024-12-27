export interface NotionTablePageProperties {
  [key: string]: NotionTablePagePropertyValue
}

export type NotionTablePagePropertyFile = { name: string; url: string }

export type NotionTablePagePropertyValue =
  | string
  | number
  | boolean
  | Date
  | NotionTablePagePropertyValue[]
  | NotionTablePagePropertyFile[]
  | null
  | undefined

export class NotionTablePage<T extends NotionTablePageProperties = NotionTablePageProperties> {
  readonly id: string

  constructor(
    id: string,
    readonly properties: T,
    readonly created_time: string,
    readonly last_edited_time: string,
    readonly archived: boolean
  ) {
    this.id = id.replace(/-/g, '')
  }

  getTitle(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getCheckbox(name: string): boolean {
    return this._getPropertyAsBoolean(name)
  }

  getCreatedBy(name: string): string {
    const value = this._getPropertyAsString(name)
    if (!value) throw new Error('Property "createdBy" should not be null')
    return value
  }

  getCreatedTime(name: string): Date {
    const value = this._getPropertyAsDate(name)
    if (!value) throw new Error('Property "createdTime" should not be null')
    return value
  }

  getDate(name: string): Date | null {
    return this._getPropertyAsDate(name)
  }

  getEmail(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getFiles(name: string): NotionTablePagePropertyFile[] {
    const value = this.properties[name]
    if (!NotionTablePage.isFilesProperty(value)) return []
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

  getLastEditedBy(name: string): string {
    const value = this._getPropertyAsString(name)
    if (!value) throw new Error('Property "lastEditedBy" should not be null')
    return value
  }

  getLastEditedTime(name: string): Date {
    const value = this._getPropertyAsDate(name)
    if (!value) throw new Error('Property "lastEditedTime" should not be null')
    return value
  }

  getMultiSelect(name: string): string[] {
    return this._getPropertyAsStringArray(name)
  }

  getNumber(name: string): number | null {
    return this._getPropertyAsNumber(name)
  }

  getPeople(name: string): string[] {
    return this._getPropertyAsStringArray(name)
  }

  getPhone(name: string): string | null {
    return this._getPropertyAsString(name)
  }

  getRelations(name: string): string[] {
    return this._getPropertyAsStringArray(name)
  }

  getSingleRelation(name: string): string | null {
    return this._getPropertyAsStringArray(name)[0] || null
  }

  getStringArrayRollup(name: string): string[] {
    return this._getPropertyAsStringArray(name)
  }

  getNumberArrayRollup(name: string): number[] {
    const value = this.properties[name]
    if (!Array.isArray(value)) return []
    return value.every((item) => typeof item === 'number') ? value : []
  }

  getBooleanArrayRollup(name: string): boolean[] {
    const value = this.properties[name]
    if (!Array.isArray(value)) return []
    return value.every((item) => typeof item === 'boolean') ? value : []
  }

  getSingleStringRollup(name: string): string | null {
    return this._getPropertyAsStringArray(name)[0] || null
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
    if (!(name in this.properties)) {
      throw new Error(`Property "${name}" does not exist`)
    }
    const value = this.properties[name]
    if (!value) return null
    return typeof value === 'string' ? value : value.toString()
  }

  private _getPropertyAsStringArray(name: string): string[] {
    const value = this._checkIfPropertyExists(name)
    if (!NotionTablePage.isStringArrayProperty(value)) return []
    return value
  }

  private _getPropertyAsDate(name: string): Date | null {
    const value = this._checkIfPropertyExists(name)
    if (!value) return null
    return value instanceof Date ? value : new Date(value.toString())
  }

  private _getPropertyAsNumber(name: string): number | null {
    const value = this._checkIfPropertyExists(name)
    if (!value) return null
    return typeof value === 'number' ? value : parseFloat(value.toString())
  }

  private _getPropertyAsBoolean(name: string): boolean {
    const value = this._checkIfPropertyExists(name)
    return typeof value === 'boolean' ? value : !!value
  }

  private _checkIfPropertyExists(name: string): NotionTablePagePropertyValue {
    if (!(name in this.properties)) {
      throw new Error(`Property "${name}" does not exist`)
    }
    return this.properties[name]
  }

  static isFilesProperty = (value: unknown): value is NotionTablePagePropertyFile[] => {
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
