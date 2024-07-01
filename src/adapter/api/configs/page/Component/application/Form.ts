import type { Method } from '@domain/entities/request'
import type { Config as Title } from '../base/Title'
import type { Config as Paragraph } from '../base/Paragraph'
import type { Config as Button } from '../base/Button'
import type { Config as Input } from '../base/Input'
import type { Base } from '../base/Base'

export interface Config extends Base {
  action: string
  method?: Method
  source?: string
  inputs: Input[]
  buttons: Button[]
  title?: Title
  paragraph?: Paragraph
  successMessage?: string
}

export interface Form extends Config {
  component: 'Form'
}
