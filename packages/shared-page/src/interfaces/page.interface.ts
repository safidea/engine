import type { ObjectInterface } from 'shared-common'
import type { ComponentInterface } from 'shared-component'

export interface MetadataInterface extends ObjectInterface {
  description?: string
}

export interface PageComponentInterface extends ComponentInterface {
  components?: PageComponentsInterface
}

export type PageComponentsInterface = PageComponentInterface[]

export interface PageInterface extends ObjectInterface {
  title: string
  metadata?: MetadataInterface
  components: PageComponentsInterface
}

export interface PagesInterface extends ObjectInterface {
  [key: string]: PageInterface
}
