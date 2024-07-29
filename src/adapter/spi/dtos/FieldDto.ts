export interface FieldDto {
  name: string
  type: 'text' | 'timestamp' | 'numeric' | 'formula'
  formula?: string
}
