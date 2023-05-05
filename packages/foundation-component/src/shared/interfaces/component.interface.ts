import type { ObjectInterface } from 'foundation-common'

export interface ComponentInterface extends ObjectInterface {
  components?: ComponentsInterface
}

export interface ComponentsInterface extends ObjectInterface {
  [key: string]: ComponentInterface
}
