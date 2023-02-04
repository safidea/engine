export type Props = {
  [key: string]: Props | Props[] | string | boolean | number | undefined
}

export type Component = {
  id: string
  type: string
  props?: Props
  components?: Component[]
}
