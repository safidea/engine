import type { ObjectInterface } from 'server-common'

export interface ComponentInterface extends ObjectInterface {
  components?: ComponentsInterface
}

export interface ComponentsInterface extends ObjectInterface {
  [key: string]: ComponentInterface
}
