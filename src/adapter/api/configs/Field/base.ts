export interface IBaseAction {
  name: string
  required?: boolean
  onMigration?: {
    replace?: string
  }
}
