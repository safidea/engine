export type Size = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

export interface TitleComponentOptions {
  type: 'title'
  text: string
  size?: Size
}
