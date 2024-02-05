export interface Text {
  text: string
  tag?: keyof HTMLElementTagNameMap
  attribute?: string
  value?: string
}
