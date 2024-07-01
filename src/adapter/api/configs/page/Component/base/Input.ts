import type { Base } from './Base'
import type { Type } from '@domain/engine/page/component/base/Input'

export interface Config extends Base {
  name: string
  type?: Type
  placeholder?: string
  label?: string
  required?: boolean
  defaultValue?: string
}

export interface Input extends Config {
  component: 'Input'
}
