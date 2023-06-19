import type { ObjectInterface } from 'shared-common'

export interface ComponentInterface extends ObjectInterface {
  key: string
  text?: string
}

export interface ComponentsInterface {
  [key: string]: ComponentInterface
}
