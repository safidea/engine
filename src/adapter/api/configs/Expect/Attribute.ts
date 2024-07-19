export interface Attribute {
  expect: 'Attribute'
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}
