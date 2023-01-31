import { Props } from './props.component.type'

export type ComponentPage = {
  id: string
  type: string
  props: Props
  namespaces?: string[]
}
