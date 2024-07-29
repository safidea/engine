export interface FieldDto {
  name: string
  type: 'text' | 'timestamp' | 'numeric' | 'enum'
  formula?: string
  options?: string[]
  required?: boolean
}
