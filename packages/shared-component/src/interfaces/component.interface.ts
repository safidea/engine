import type { ObjectInterface } from 'shared-common'

export interface ComponentInterface extends ObjectInterface {
  components?: ComponentsInterface
}

export interface ComponentsInterface extends ObjectInterface {
  [key: string]: ComponentInterface
}
