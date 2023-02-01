export type Props = {
  [key: string]: Props | Props[] | string | boolean | number
}

export type Component = {
  id: string
  type: string
  props: Props
  namespaces?: string[]
}
