export interface FieldDto {
  name: string
  type: 'text' | 'timestamp' | 'numeric' | 'reference'
  formula?: string
  options?: string[]
  required?: boolean
  table?: string
}
