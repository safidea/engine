import type { ObjectInterface } from 'shared-common'

export interface ComponentInterface extends ObjectInterface {
  key: string
  components?: ComponentsInterface
  text?: string
}

export type ComponentsInterface = ComponentInterface[]
