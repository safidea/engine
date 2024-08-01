export interface Base {
  name: string
  required?: boolean
  onMigration?: {
    replace?: string
  }
}
